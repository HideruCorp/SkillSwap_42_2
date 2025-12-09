import type { Meta, StoryObj } from '@storybook/react-vite';
import SkillGallery from './SkillGallery';

const meta: Meta<typeof SkillGallery> = {
  title: 'Widgets/SkillGallery',
  component: SkillGallery,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SkillGallery>;

// Одна картинка
export const OneImage: Story = {
  args: {
    images: ['https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=450&fit=crop'],
    title: 'Йога',
  },
};

// Несколько картинок
export const ManyImages: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=450&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=450&fit=crop',
    ],
    title: 'Фотография',
  },
};

// Пустой список
export const NoImages: Story = {
  args: {
    images: [],
    title: 'Пустой список',
  },
};
