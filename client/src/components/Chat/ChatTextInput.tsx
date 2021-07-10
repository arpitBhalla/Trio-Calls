import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import Fab from "@material-ui/core/Fab";

type ChatTextInputProps = {
  onSend?: (message: string) => unknown;
  isSmall?: boolean;
};

const useStyles = makeStyles((theme) => ({
  rootBox: {
    display: "flex",
    alignItems: "center",
    bottom: 0,
  },
  sendIcon: {
    marginLeft: theme.spacing(2),
    paddingLeft: 4,
  },
}));

const ChatTextInput: React.FC<ChatTextInputProps> = ({ onSend, isSmall }) => {
  const classes = useStyles();
  const [text, setText] = React.useState("");

  return (
    <Box className={classes.rootBox}>
      <TextField
        fullWidth
        placeholder="Send a message to everyone"
        variant="outlined"
        margin={isSmall ? "dense" : "none"}
        onChange={(e) => setText(e.target.value)}
      />
      <div>
        <Fab
          size={isSmall ? "small" : "medium"}
          color="primary"
          aria-label="send message"
          className={classes.sendIcon}
          onClick={() => onSend?.(text)}
        >
          <SendOutlinedIcon fontSize={"small"} />
        </Fab>
      </div>
    </Box>
  );
};
export default ChatTextInput;
