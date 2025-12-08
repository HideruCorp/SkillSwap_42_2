import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || '');
    return <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};
