import * as RxTooltip from '@radix-ui/react-tooltip';
import PropTypes from 'prop-types';
import './styles.css';

const DEFAULT_DELAY_MILISSEGUNDOS = 300;

const Tooltip = ({ children, value, sideOffset, delayDuration, ...props }) => {
  return (
    <RxTooltip.Provider delayDuration={delayDuration ?? DEFAULT_DELAY_MILISSEGUNDOS}>
      <RxTooltip.Root>
        <RxTooltip.Trigger asChild>{children}</RxTooltip.Trigger>
        <RxTooltip.Portal>
          <RxTooltip.Content className="TooltipContent" sideOffset={sideOffset ?? 5} {...props}>
            {value}
            <RxTooltip.Arrow className="TooltipArrow" />
          </RxTooltip.Content>
        </RxTooltip.Portal>
      </RxTooltip.Root>
    </RxTooltip.Provider>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  sideOffset: PropTypes.number,
  delayDuration: PropTypes.number,
};

export default Tooltip;
