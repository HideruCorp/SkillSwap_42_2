import React from 'react';
import cn from 'classnames';
import Button from '@shared/ui/button/Button';

import ChevronRight from '@shared/assets/img/chevron-Right.svg?react';
import styles from './SectionHeaderUI.module.scss';
import type { SectionHeaderProps } from './type';

const SectionHeaderUI: React.FC<SectionHeaderProps> = ({
  title,
  onAction,
  actionLabel,
  className,
}) => {
  const hasAction = actionLabel && onAction;

  return (
    <div className={cn(styles.wrapper, className)}>
      <h2 className={styles.title}>{title}</h2>

      {hasAction && (
        <div className={styles.actionWrapper}>
          <Button
            title={actionLabel}
            onClick={onAction}
            type="tertiary"
            className={styles.hideTextMobile}
            iconRight={<ChevronRight />}
          />
        </div>
      )}
    </div>
  );
};

export default SectionHeaderUI;
