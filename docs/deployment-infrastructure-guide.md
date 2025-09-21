# FeedMaster Deployment & Infrastructure Guide

## Обзор

Этот документ описывает инфраструктуру и процессы деплоймента для FeedMaster - платформы автоматической публикации контента в Telegram.

---

## 🏗️ Архитектура инфраструктуры

### Production Environment
```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer (Cloudflare)               │
│                         SSL Termination                     │
└─────────────────────┬───────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────────────────┐
│                  Kubernetes Cluster                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ Frontend    │ │ API Gateway │ │    Microservices        ││
│  │ (Next.js)   │ │ (FastAPI)   │ │ ┌─────┐ ┌─────┐ ┌─────┐││
│  │             │ │             │ │ │Auth │ │Bots │ │Content│││
│  └─────────────┘ └─────────────┘ │ │Svc  │ │Svc  │ │Svc    │││
│                                  │ └─────┘ └─────┘ └─────┘││
│                                  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────────────────┐
│                   Data Layer                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ PostgreSQL  │ │    Redis    │ │    Object Storage       ││
│  │   (RDS)     │ │ (ElastiCache│ │        (S3)             ││
│  │             │ │             │ │                         ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 Облачная инфраструктура

### AWS Setup (Рекомендуемый)

#### VPC Configuration
```yaml
# terraform/vpc.tf
resource "aws_vpc" "feedmaster" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "feedmaster-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "private" {
  count  = 2
  vpc_id = aws_vpc.feedmaster.id
  
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "feedmaster-private-${count.index + 1}"
    Type = "private"
  }
}

resource "aws_subnet" "public" {
  count  = 2
  vpc_id = aws_vpc.feedmaster.id
  
  cidr_block              = "10.0.${count.index + 10}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "feedmaster-public-${count.index + 1}"
    Type = "public"
  }
}
```

#### EKS Cluster
```yaml
# terraform/eks.tf
resource "aws_eks_cluster" "feedmaster" {
  name     = "feedmaster-${var.environment}"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = concat(aws_subnet.private[*].id, aws_subnet.public[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = ["0.0.0.0/0"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]
}

resource "aws_eks_node_group" "feedmaster" {
  cluster_name    = aws_eks_cluster.feedmaster.name
  node_group_name = "feedmaster-nodes"
  node_role_arn   = aws_iam_role.eks_nodegroup.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 2
  }

  instance_types = ["t3.medium", "t3.large"]

  remote_access {
    ec2_ssh_key = var.ssh_key_name
  }
}
```

#### RDS Database
```yaml
# terraform/rds.tf
resource "aws_db_subnet_group" "feedmaster" {
  name       = "feedmaster-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "FeedMaster DB subnet group"
  }
}

resource "aws_db_instance" "feedmaster" {
  identifier = "feedmaster-${var.environment}"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"  # Для prod: db.r5.large
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = "feedmaster"
  username = var.db_username
  password = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.feedmaster.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment != "production"
  deletion_protection = var.environment == "production"

  tags = {
    Name = "feedmaster-db"
    Environment = var.environment
  }
}
```

#### ElastiCache Redis
```yaml
# terraform/redis.tf
resource "aws_elasticache_subnet_group" "feedmaster" {
  name       = "feedmaster-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "feedmaster" {
  replication_group_id       = "feedmaster-${var.environment}"
  description                = "Redis cluster for FeedMaster"
  
  node_type                  = "cache.t3.micro"  # Для prod: cache.r6g.large
  port                       = 6379
  parameter_group_name       = "default.redis7"
  
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled          = true
  
  subnet_group_name = aws_elasticache_subnet_group.feedmaster.name
  security_group_ids = [aws_security_group.redis.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  tags = {
    Name = "feedmaster-redis"
    Environment = var.environment
  }
}
```

---

## 🐳 Docker Configuration

### Multi-stage Dockerfile для Backend
```dockerfile
# Dockerfile.backend
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Add local bin to PATH
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile для Frontend
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose для Development
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000

  api-gateway:
    build:
      context: ./backend/api-gateway
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - ./backend/api-gateway:/app
    environment:
      - DATABASE_URL=postgresql://feedmaster:password@postgres:5432/feedmaster
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  auth-service:
    build:
      context: ./backend/auth-service
      dockerfile: Dockerfile.dev
    ports:
      - "8001:8001"
    volumes:
      - ./backend/auth-service:/app
    environment:
      - DATABASE_URL=postgresql://feedmaster:password@postgres:5432/feedmaster
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  content-service:
    build:
      context: ./backend/content-service
      dockerfile: Dockerfile.dev
    ports:
      - "8003:8003"
    volumes:
      - ./backend/content-service:/app
    environment:
      - DATABASE_URL=postgresql://feedmaster:password@postgres:5432/feedmaster
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  celery-worker:
    build:
      context: ./backend/content-service
      dockerfile: Dockerfile.dev
    command: celery -A tasks worker --loglevel=info
    volumes:
      - ./backend/content-service:/app
    environment:
      - DATABASE_URL=postgresql://feedmaster:password@postgres:5432/feedmaster
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  celery-beat:
    build:
      context: ./backend/content-service
      dockerfile: Dockerfile.dev
    command: celery -A tasks beat --loglevel=info
    volumes:
      - ./backend/content-service:/app
    environment:
      - DATABASE_URL=postgresql://feedmaster:password@postgres:5432/feedmaster
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: feedmaster
      POSTGRES_USER: feedmaster
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

---

## ☸️ Kubernetes Deployment

### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: feedmaster
  labels:
    name: feedmaster
    environment: production
```

### ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: feedmaster-config
  namespace: feedmaster
data:
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  REDIS_URL: "redis://feedmaster-redis:6379/0"
  DATABASE_HOST: "feedmaster-db.cluster-xyz.us-west-2.rds.amazonaws.com"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "feedmaster"
```

### Secrets
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: feedmaster-secrets
  namespace: feedmaster
type: Opaque
data:
  DATABASE_USER: ZmVlZG1hc3Rlcg==  # base64 encoded
  DATABASE_PASSWORD: cGFzc3dvcmQ=   # base64 encoded
  JWT_SECRET_KEY: eW91ci1zZWNyZXQta2V5  # base64 encoded
  ENCRYPTION_KEY: ZW5jcnlwdGlvbi1rZXk=   # base64 encoded
```

### API Gateway Deployment
```yaml
# k8s/api-gateway.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: feedmaster
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: feedmaster/api-gateway:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: feedmaster-config
        - secretRef:
            name: feedmaster-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: feedmaster
spec:
  selector:
    app: api-gateway
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
  namespace: feedmaster
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.feedmaster.io
    secretName: api-tls
  rules:
  - host: api.feedmaster.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 80
```

### Frontend Deployment
```yaml
# k8s/frontend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: feedmaster
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: feedmaster/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.feedmaster.io"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: feedmaster
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
  namespace: feedmaster
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - feedmaster.io
    - www.feedmaster.io
    secretName: frontend-tls
  rules:
  - host: feedmaster.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
  - host: www.feedmaster.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### Horizontal Pod Autoscaler
```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: feedmaster
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy FeedMaster

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-west-2
  EKS_CLUSTER_NAME: feedmaster-production

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: 3.11
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
        pip install pytest pytest-asyncio
    
    - name: Run tests
      run: |
        cd backend
        pytest tests/ -v --cov=./ --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker images
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
      run: |
        # Build and push backend services
        for service in api-gateway auth-service content-service bot-service; do
          docker build -t $ECR_REGISTRY/feedmaster-$service:$GITHUB_SHA backend/$service/
          docker tag $ECR_REGISTRY/feedmaster-$service:$GITHUB_SHA $ECR_REGISTRY/feedmaster-$service:latest
          docker push $ECR_REGISTRY/feedmaster-$service:$GITHUB_SHA
          docker push $ECR_REGISTRY/feedmaster-$service:latest
        done
        
        # Build and push frontend
        docker build -t $ECR_REGISTRY/feedmaster-frontend:$GITHUB_SHA frontend/
        docker tag $ECR_REGISTRY/feedmaster-frontend:$GITHUB_SHA $ECR_REGISTRY/feedmaster-frontend:latest
        docker push $ECR_REGISTRY/feedmaster-frontend:$GITHUB_SHA
        docker push $ECR_REGISTRY/feedmaster-frontend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name ${{ env.EKS_CLUSTER_NAME }}
    
    - name: Deploy to Kubernetes
      run: |
        # Update image tags in deployment files
        sed -i "s|feedmaster/api-gateway:latest|$ECR_REGISTRY/feedmaster-api-gateway:$GITHUB_SHA|g" k8s/*.yaml
        sed -i "s|feedmaster/frontend:latest|$ECR_REGISTRY/feedmaster-frontend:$GITHUB_SHA|g" k8s/*.yaml
        
        # Apply Kubernetes manifests
        kubectl apply -f k8s/
        
        # Wait for rollout to complete
        kubectl rollout status deployment/api-gateway -n feedmaster
        kubectl rollout status deployment/frontend -n feedmaster
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
```

### ArgoCD Configuration
```yaml
# argocd/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: feedmaster
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/leszavr/feedmaster
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: feedmaster
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

---

## 📊 Monitoring & Observability

### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:8000']
    metrics_path: /metrics
    scrape_interval: 5s

  - job_name: 'auth-service'
    static_configs:
      - targets: ['auth-service:8001']
    metrics_path: /metrics

  - job_name: 'content-service'
    static_configs:
      - targets: ['content-service:8003']
    metrics_path: /metrics

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
```

### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "FeedMaster Overview",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph", 
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
            "legendFormat": "Error Rate"
          }
        ]
      },
      {
        "title": "Content Processing Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(posts_processed_total[5m]))",
            "legendFormat": "Posts/second"
          }
        ]
      }
    ]
  }
}
```

### Alerting Rules
```yaml
# monitoring/alerts.yml
groups:
- name: feedmaster.rules
  rules:
  - alert: HighErrorRate
    expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High error rate detected
      description: "Error rate is {{ $value }} which is above the threshold"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.5
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: High response time detected
      description: "95th percentile response time is {{ $value }}s"

  - alert: DatabaseConnectionsHigh
    expr: pg_stat_database_numbackends > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High number of database connections
      description: "Number of database connections is {{ $value }}"
```

---

## 🔒 Security Configuration

### Network Policies
```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: feedmaster-network-policy
  namespace: feedmaster
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: nginx-ingress
    - namespaceSelector:
        matchLabels:
          name: feedmaster
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 443  # HTTPS
    - protocol: TCP
      port: 53   # DNS
    - protocol: UDP
      port: 53   # DNS
```

### Pod Security Policy
```yaml
# k8s/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: feedmaster-psp
  namespace: feedmaster
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

---

## 🚨 Disaster Recovery

### Database Backup Strategy
```bash
#!/bin/bash
# scripts/backup-db.sh

DB_HOST="feedmaster-db.cluster-xyz.us-west-2.rds.amazonaws.com"
DB_NAME="feedmaster"
DB_USER="feedmaster"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/feedmaster_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/feedmaster_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/feedmaster_$DATE.sql.gz s3://feedmaster-backups/database/

# Cleanup old local backups (keep last 7 days)
find $BACKUP_DIR -name "feedmaster_*.sql.gz" -mtime +7 -delete
```

### Backup CronJob
```yaml
# k8s/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
  namespace: feedmaster
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME | gzip > /backup/feedmaster_$(date +%Y%m%d_%H%M%S).sql.gz
              aws s3 cp /backup/*.sql.gz s3://feedmaster-backups/database/
            envFrom:
            - secretRef:
                name: feedmaster-secrets
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure
```

### Disaster Recovery Plan
```markdown
## Disaster Recovery Procedures

### RTO (Recovery Time Objective): 4 hours
### RPO (Recovery Point Objective): 1 hour

### Scenario 1: Database Failure
1. **Immediate Response** (0-15 minutes)
   - Switch traffic to maintenance page
   - Assess extent of database damage
   - Notify team via PagerDuty

2. **Recovery** (15-60 minutes)
   - Restore from latest automated backup
   - If backup corrupted, restore from previous day
   - Run data integrity checks

3. **Validation** (60-90 minutes)
   - Test all critical functions
   - Verify data consistency
   - Run smoke tests

### Scenario 2: Complete Cluster Failure
1. **Immediate Response** (0-30 minutes)
   - Activate DR cluster in different AZ
   - Update DNS to point to DR environment
   - Notify stakeholders

2. **Recovery** (30-120 minutes)
   - Restore latest database backup to DR cluster
   - Deploy latest application version
   - Configure monitoring and logging

3. **Validation** (120-180 minutes)
   - Full end-to-end testing
   - Performance validation
   - User acceptance testing
```

---

## 🔧 Maintenance Procedures

### Rolling Updates
```bash
#!/bin/bash
# scripts/rolling-update.sh

set -e

NAMESPACE="feedmaster"
NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
    echo "Usage: $0 <new-version>"
    exit 1
fi

echo "Starting rolling update to version $NEW_VERSION"

# Update deployment images
kubectl set image deployment/api-gateway api-gateway=feedmaster/api-gateway:$NEW_VERSION -n $NAMESPACE
kubectl set image deployment/auth-service auth-service=feedmaster/auth-service:$NEW_VERSION -n $NAMESPACE
kubectl set image deployment/content-service content-service=feedmaster/content-service:$NEW_VERSION -n $NAMESPACE
kubectl set image deployment/frontend frontend=feedmaster/frontend:$NEW_VERSION -n $NAMESPACE

# Wait for rollout to complete
echo "Waiting for rollout to complete..."
kubectl rollout status deployment/api-gateway -n $NAMESPACE --timeout=600s
kubectl rollout status deployment/auth-service -n $NAMESPACE --timeout=600s
kubectl rollout status deployment/content-service -n $NAMESPACE --timeout=600s
kubectl rollout status deployment/frontend -n $NAMESPACE --timeout=600s

echo "Rolling update completed successfully"
```

### Database Migrations
```bash
#!/bin/bash
# scripts/migrate-db.sh

set -e

NAMESPACE="feedmaster"
MIGRATION_IMAGE="feedmaster/db-migrations:latest"

echo "Running database migrations..."

kubectl run db-migration \
  --image=$MIGRATION_IMAGE \
  --restart=Never \
  --rm -i \
  --env-from=secret/feedmaster-secrets \
  -n $NAMESPACE \
  -- alembic upgrade head

echo "Database migrations completed"
```

---

## 🎯 Performance Tuning

### Database Optimization
```sql
-- PostgreSQL performance tuning
-- postgresql.conf settings

# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB
min_wal_size = 1GB
max_wal_size = 4GB

# Connection settings
max_connections = 100
shared_preload_libraries = 'pg_stat_statements'

# Logging
log_min_duration_statement = 1000
log_checkpoints = on
log_connections = on
log_disconnections = on
```

### Redis Configuration
```conf
# redis.conf optimization

# Memory management
maxmemory 512mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Network
tcp-keepalive 300
timeout 0

# Logs
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Application Performance
```python
# Backend optimization settings

# FastAPI configuration
app = FastAPI(
    title="FeedMaster API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Connection pooling
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Redis connection pool
redis_pool = aioredis.ConnectionPool.from_url(
    REDIS_URL,
    max_connections=20,
    retry_on_timeout=True,
)

# Caching configuration
CACHE_TTL = {
    "users": 300,      # 5 minutes
    "bots": 600,       # 10 minutes
    "sources": 1800,   # 30 minutes
    "posts": 300,      # 5 minutes
}
```

---

Эта документация обеспечивает полное понимание инфраструктуры и процессов деплоймента для успешного запуска FeedMaster в продакшене.