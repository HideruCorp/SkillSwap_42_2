import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroupUI } from './RadioGroupUI';

const meta: Meta<typeof RadioGroupUI> = {
  title: 'Components/RadiogroupUi',
  component: RadioGroupUI,
} satisfies Meta<typeof RadioGroupUI>;

export default meta;
type Story = StoryObj<typeof RadioGroupUI>;

export const Interactive: Story = {
  render: function Render() {
    const [selectedValue, setSelectedValue] = useState('all');

    const options = [
      { label: 'Все', value: 'all' },
      { label: 'Хочу научиться', value: 'want' },
      { label: 'Могу научить', value: 'can' },
    ];

    return (
      <div>
        <RadioGroupUI
          name="filter-type"
          options={options}
          value={selectedValue}
          onChange={setSelectedValue}
        />
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
          Выбрано: <strong>{selectedValue}</strong>
        </div>
      </div>
    );
  },
};
