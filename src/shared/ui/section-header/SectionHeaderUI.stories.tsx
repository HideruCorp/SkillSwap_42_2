import type { Meta, StoryObj } from '@storybook/react';
import SectionHeaderUI from './SectionHeaderUI';

const meta: Meta<typeof SectionHeaderUI> = {
  title: 'Shared/SectionHeaderUI',
  component: SectionHeaderUI,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeaderUI>;

// 1. Только заголовок
export const OnlyTitle: Story = {
  args: {
    title: 'Новое',
  },
};

// 2. Заголовок + кнопка
export const WithButton: Story = {
  args: {
    title: 'Новое',
    actionLabel: 'Смотреть все',
    onAction: () => alert('Clicked!'),
  },
};

// 3. Длинный текст
export const LongTitle: Story = {
  args: {
    title: 'Подходящие предложения: 12',
    actionLabel: 'Смотреть все',
    onAction: () => alert('Clicked!'),
  },
};
