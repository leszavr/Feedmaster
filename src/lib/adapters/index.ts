// Экспорт всех типов и интерфейсов
export * from './types';

// Экспорт базового адаптера и интерфейса
export * from './base-adapter';

// Экспорт конкретных адаптеров
export * from './telegram-adapter';
export * from './max-adapter';

// Экспорт фабрики и менеджера
export * from './factory';

// Удобные реэкспорты
export { MessengerAdapterFactory as AdapterFactory } from './factory';
export { MessengerAdapterManager as AdapterManager } from './factory';