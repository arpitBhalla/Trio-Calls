import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "core/hooks/redux";
import { updateAuth } from "core/actions/auth";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PasswordIcon from "@material-ui/icons/LockOpen";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const INITIAL_STATE = { text: "", error: "" };

const useStyles = makeStyles((theme) => ({
  logo: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const { isAuth } = useAppSelector(({ authReducer }) => authReducer);

  const redirect_url = new URLSearchParams(search).get("redirect_url") || "/";

  const [email, setEmail] = React.useState(INITIAL_STATE);
  const [emailExist, setEmailExist] = React.useState(false);
  const [password, setPassword] = React.useState(INITIAL_STATE);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuth) {
      history.push(redirect_url);
    }
  }, [isAuth, redirect_url, history]);

  return (
    <Container maxWidth="xs">
      <Box boxShadow="0px 0px 30px 1px rgb(214, 214, 214)" p={4} py={5} mt={10}>
        <Typography align="center">
          <img
            alt="MS Teams"
            className={classes.logo}
            src="https://heliocentrix.co.uk/wp-content/uploads/2020/04/microsoft-teams-logo-png_480-480.png"
          />
        </Typography>
        <Typography variant="h5" align="center" color="primary">
          Sign in
        </Typography>
        <Typography variant="body1" align="center" color="primary">
          Use your MT Account
        </Typography>
        <Box py={2}>
          <Collapse in={!emailExist} timeout={200}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                margin="normal"
                placeholder="Email"
                variant="outlined"
                value={email.text}
                onChange={(e) => {
                  setEmail({ error: "", text: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEmailExist(true);
                }}
                autoFocus
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        color={!Boolean(email.error) ? "action" : "error"}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText>{email.error}</FormHelperText>
            </FormControl>
          </Collapse>

          <Collapse in={emailExist} timeout={200}>
            <>
              <FormControl fullWidth error={Boolean(password.error)}>
                <TextField
                  margin="normal"
                  placeholder="Password"
                  variant="outlined"
                  type="password"
                  error={Boolean(password.error)}
                  onChange={(e) => {
                    setPassword({ error: "", text: e.target.value });
                  }}
                  value={password.text}
                  onKeyDown={(e) => {
                    // if (e.key === "Enter") checkEmail();
                  }}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon
                          color={!Boolean(password.error) ? "primary" : "error"}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText>{password.error}</FormHelperText>
              </FormControl>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  disabled={loading}
                  style={{ textTransform: "capitalize" }}
                  onClick={() => setEmailExist(false)}
                >
                  Go Back
                </Button>
              </Box>
            </>
          </Collapse>
        </Box>
        <Button
          fullWidth
          // className={classes.button}
          size="large"
          color="primary"
          variant="contained"
          disabled={loading}
          onClick={() =>
            !emailExist
              ? setEmailExist(true)
              : dispatch(updateAuth({ isAuth: true, displayName: "Arpit" }))
          }
        >
          {emailExist ? "Login" : "Next"}
        </Button>
      </Box>
    </Container>
  );
};

export default Auth;
