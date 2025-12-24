import type { SectionHeaderProps } from './type'
import ChevronRight from '@shared/assets/img/chevron-Right.svg?react'
import Button from '@shared/ui/button/Button'

import cn from 'classnames'
import React from 'react'
import styles from './SectionHeaderUI.module.scss'

const SectionHeaderUI: React.FC<SectionHeaderProps> = ({
  title,
  onAction,
  actionLabel,
  className,
  extraAction,
}) => {
  const hasAction = actionLabel && onAction

  return (
    <div className={cn(styles.wrapper, className)}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.actionsWrapper}>
        {extraAction && <div className={styles.extraAction}>{extraAction}</div>}
        {hasAction && (
          <div className={styles.actionWrapper}>
            <Button
              title={actionLabel}
              onClick={onAction}
              variant="tertiary"
              className={styles.hideTextMobile}
              iconRight={<ChevronRight />}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionHeaderUI
