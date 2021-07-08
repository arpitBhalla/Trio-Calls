import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import {
  MicOutlined,
  MicOffOutlined,
  VideocamOffOutlined,
  VideocamOutlined,
  CancelPresentationOutlined,
  PresentToAllOutlined,
  PanToolOutlined,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { useAppDispatch, useAppSelector } from "core/hooks/redux";
import { toggleAudio, toggleScreen, toggleVideo } from "core/reducers/media";
import ControlButton from "components/ControllerButton";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    bottom: 20,
    transform: "translateX(-50%)",
    left: "50%",
  },
}));

const Controller: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { isAudio, isVideo, isScreenShare } = useAppSelector(
    ({ mediaReducer }) => mediaReducer
  );

  return (
    <Box className={classes.root}>
      <ControlButton
        title="Microphone"
        isEnabled={isAudio}
        IconOn={MicOutlined}
        IconOff={MicOffOutlined}
        onClick={() => dispatch(toggleAudio(null))}
      />
      <ControlButton
        title="Video"
        isEnabled={isVideo}
        IconOn={VideocamOutlined}
        IconOff={VideocamOffOutlined}
        onClick={() => dispatch(toggleVideo(null))}
      />
      <ControlButton
        title="ScreenShare"
        isEnabled={isScreenShare}
        IconOn={PresentToAllOutlined}
        IconOff={CancelPresentationOutlined}
        onClick={() => dispatch(toggleScreen(null))}
      />

      <Tooltip title="Raise Hand">
        <IconButton>
          <PanToolOutlined />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default Controller;
