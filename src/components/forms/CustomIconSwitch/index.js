import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { useSwitch } from '@mui/base/SwitchUnstyled';
import { blue, grey } from '@mui/material/colors';


const SwitchRoot = styled('span')`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 36px;
  padding: 8px;
`;

const SwitchInput = styled('input')`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`;

const SwitchThumb = styled('span')`
  position: absolute;
  display: block;
  background-color: ${blue[500]};
  width: 30px;
  height: 30px;
  border-radius: 8px;
  top: 3px;
  left: 4px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 25.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cg fill='%23fff' transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'%3E%3Cpath d='M1412.5,3514.5V3409h-84.9h-84.9v-383.3v-383.3h84.9h84.9v-571.2V1500h169.8h169.8v360.2v360.2H2560h807.9v-360.2V1500 h169.8h169.8v571.2v571.2h84.9h84.9v383.3V3409h-84.9h-84.9v105.5V3620h-169.8h-169.8v-105.5V3409H2560h-807.9v105.5V3620h-169.8 h-169.8V3514.5z M1669.8,3473.3V3409h-84.9H1500v64.3v64.3h84.9h84.9V3473.3z M3620,3473.3V3409l-83.4,1l-83.9,1.5l-1.5,56.1 c-0.5,31.4,0,59.7,1,63.3c2.1,5.1,21.6,6.7,85.4,6.7h82.3V3473.3z M1880.8,3324.6c0-1-100.3-98.8-222.3-217.1 C1536,2989.1,1412,2869.3,1383.2,2841l-53-51.5v268.6v268.6h275.3C1756.8,3326.7,1880.8,3325.7,1880.8,3324.6z M2475.1,3301.5 c-14.4-14.4-152.8-148.7-308.7-298.4l-283-273.2h-246.5h-246.5l86.4,83.9c47.9,45.8,186.3,180.1,308.2,297.9l221.8,214.6l247,0.5 h247L2475.1,3301.5z M3109.6,3322.6c-0.5-2.1-137.9-136.4-305.1-297.9l-303.6-294.3h-247l-247-0.5l43.7,43.2 c24.2,23.7,162.6,158,308.2,298.4l264.5,255.2h243.9C3001.5,3326.7,3110.6,3324.6,3109.6,3322.6z M3684.3,3280.9 c-25.7-25.2-164.1-159.5-308.2-298.4l-261.4-252.7h-246.5h-246l83.4,80.8c158.5,153.9,238.2,231.6,385.4,373.6l147.2,142.5h246.5 h246L3684.3,3280.9z M3793.4,2731.3c-1-1-126.1-1-277.9-0.5l-276.3,1.5l276.8,267.1l276.3,267.6l1.5-267.1 C3794.4,2853.3,3794.4,2732.4,3793.4,2731.3z M1669.8,2112.3v-530h-84.9H1500v530v530h84.9h84.9V2112.3z M3367.9,2472.5v-169.8 H2560h-807.9v169.8v169.8H2560h807.9V2472.5z M3620,2112.3v-530h-84.9h-84.9v530v530h84.9h84.9V2112.3z'/%3E%3C/g%3E%3C/svg%3E%0A");
  }

  &.focusVisible {
    background-color: #79b;
  }

  &.checked {
    transform: translateX(24px);

    &::before {
      background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 25.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cg fill='%23fff' transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'%3E%3Cpath d='M3143.9,3693.2c-18.1-7.4-43.7-31.8-55.6-53.3c-8.5-14.7-9.6-41.4-11.3-185.4l-1.7-169l-378.8-1.1l-378.2-1.7L2298,3269 c-79.4-54.4-57.3-167.8,36.9-187.7c21.5-4,157.1-5.7,452.5-4.5c460.4,1.7,437.2,0,468.3,34c25.5,27.2,30.1,49.3,30.1,144.6v89.6 l236.4-237l237-236.4l-237-236.4l-236.4-237v89.6c0,114-8.5,138.3-57.8,163.3c-20.4,10.2-43.1,10.8-602.1,10.8h-581.2l-1.7,169 c-1.7,162.2-2.3,169.5-14.2,192.2c-23.8,43.7-82.2,64.6-130.4,47.1c-23.8-9.1-765.4-751.3-779.1-779.6c-13.6-28.9-13.6-56.1,0-85 c7.4-15.3,130.4-142.3,386.7-397.5c404.8-403.7,391.8-392.4,445.7-386.1c28.9,2.8,60.7,25.5,78.2,55.6 c10.8,18.1,11.3,31.2,13,187.7l2.3,169l378.2,1.1l378.2,1.7l20.4,13.6c79.4,54.4,57.3,167.8-36.9,187.7 c-21.5,4-157.1,5.7-452.5,4.5c-459.8-1.7-437.7,0-467.8-34c-25.5-27.2-27.8-38.6-30.6-136.6l-2.8-94.7l-237,236.4l-236.4,237 l238.1,238.1l238.1,238.1v-92.4c0-117.4,7.9-140.6,57.8-166.1c20.4-10.2,43.1-10.8,602.1-10.8h581.2l1.7-168.4 c1.7-162.7,2.3-170.1,14.2-192.8c23.8-43.7,82.2-64.6,130.4-47.1c23.8,9.1,765.4,751.3,779.1,779.6c13,27.8,13.6,53.3,2.3,81.1 c-12.5,28.9-744.5,763.2-776.8,778.5C3201.8,3700,3166.6,3702.2,3143.9,3693.2z'/%3E%3C/g%3E%3C/svg%3E%0A");
    }
  }
`;

const SwitchTrack = styled('span')(
  ({ theme }) => `
  background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[400]};
  border-radius: 4px;
  width: 100%;
  height: 100%;
  display: block;
`,
);

export function MUISwitch(props) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);

  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  };

  return (
    <SwitchRoot className={clsx(stateClasses)}>
      <SwitchTrack>
        <SwitchThumb className={clsx(stateClasses)} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} aria-label="Demo switch" />
    </SwitchRoot>
  );
}

export default function UseSwitchesCustom() {
  return <MUISwitch defaultChecked />;
}