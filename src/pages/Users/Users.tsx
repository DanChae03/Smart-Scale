import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useState } from "react";
import { StyledTextField } from "../../components/StyledTextField";
import Button from "@mui/material/Button";
import { Search } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { DataEntry } from "../../components/DataEntry";
import { StyledDialog } from "../../components/StyledDialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { StyledButton } from "../../components/StyledButton";
import { User } from "../../utils/types";
import Snackbar from "@mui/material/Snackbar";
import { Divider } from "@mui/material";
import { LanguageContext } from "../App";
import { API_URL } from "../../utils/dbUtils";

export function Users(): ReactElement {
  const [givenName, setGivenName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoading, setuserLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [userDialogOpen, setUserDialogOpen] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const { language } = useContext(LanguageContext);

  const getUsers = (): void => {
    setLoading(true);
    fetch(
      `${API_URL}/api/admin/users?firstName=${givenName}&lastName=${surname}`,
      {
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setHasSearched(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const updateUser = (): void => {
    setuserLoading(true);
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(`${API_URL}/api/admin/update-roles?_csrf=${data.token}`, {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            userId: selectedUser?.userId,
            roles: selectedUser?.roles,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (response.ok && selectedUser != null) {
            handleResult("Successfully updated Roles.", false);
            const newUsers = users.filter(
              (user) => user.userId != selectedUser?.userId
            );
            newUsers.push(selectedUser);
            setUsers(newUsers);
            setuserLoading(false);
            setUserDialogOpen(false);
          } else {
            handleResult("Error updating Roles. Please try again.", true);
          }
        })
      )
      .catch((error) => {
        setuserLoading(false);
        console.error(error);
      });
  };

  const handleRoleChange = (role: string): void => {
    if (disabled) {
      setDisabled(false);
    }
    if (selectedUser?.roles?.includes(role)) {
      setSelectedUser({
        ...selectedUser,
        roles: selectedUser.roles.filter((newRole) => newRole != role),
      });
    } else {
      const newRoles: string[] = structuredClone(selectedUser?.roles) ?? [
        "PARENT",
      ];
      newRoles.push(role);
      setSelectedUser({ ...selectedUser, roles: newRoles });
    }
  };

  const handleResult = (message: string, error: boolean): void => {
    setError(error);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && givenName && surname) {
      getUsers();
    }
  };

  return (
    <Stack paddingX="80px" spacing="18px">
      <Typography variant="h3" sx={{ color: "primary.dark" }}>
        {language == "English" ? "Users" : "Kaiwhakamahi"}
      </Typography>
      <Stack direction="row" spacing="18px">
        <Stack width="350px">
          <StyledTextField
            label={language == "English" ? "Given Name" : "Ingoa Hoatu"}
            value={givenName}
            onKeyDown={handleKeyDown}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setGivenName(event.target.value);
            }}
            InputLabelProps={{
              style: { fontWeight: "500" },
            }}
            inputProps={{
              style: {
                fontWeight: "500",
              },
            }}
          />
        </Stack>
        <Stack width="350px">
          <StyledTextField
            label={language == "English" ? "Last Name" : "Ingoa Whakamutunga"}
            value={surname}
            onKeyDown={handleKeyDown}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setSurname(event.target.value);
            }}
            InputLabelProps={{ style: { fontWeight: "500" } }}
            inputProps={{
              style: {
                fontWeight: "500",
              },
            }}
          />
        </Stack>
        <Button
          onClick={() => {
            getUsers();
          }}
          disabled={!givenName || !surname || loading}
          sx={{
            color: "background.paper",
            bgcolor: "primary.main",
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "primary.dark",
              color: "background.paper",
            },
            "&:disabled": {
              bgcolor: "background.default",
            },
          }}
        >
          <Search />
        </Button>
        {loading && (
          <CircularProgress size="36px" sx={{ alignSelf: "center" }} />
        )}
      </Stack>
      <Stack>
        <Divider />
        <Typography
          display={loading || users.length !== 0 ? "none" : "auto"}
          marginTop="18px"
        >
          {hasSearched && users.length === 0
            ? language == "English"
              ? "No users found."
              : "Karekau he kaiwhakamahi i kitea"
            : language == "English"
            ? "Please search for a user."
            : "Tena koa rapu mo tetahi kaiwhakamahi."}
        </Typography>
        <Stack
          paddingTop="18px"
          display={users.length === 0 ? "none" : "flex"}
          spacing="18px"
          height="calc(100vh - 272px)"
          sx={{
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {users.map((user) => (
            <DataEntry
              key={user.userId}
              onClick={() => {
                setSelectedUser(user);
                setUserDialogOpen(true);
              }}
              inputAdornment={
                <Typography width="110px" sx={{ color: "primary.dark" }}>
                  {user.roles == null
                    ? "PARENT"
                    : user.roles.includes("ADMIN")
                    ? "ADMIN"
                    : user.roles.includes("RECEPTIONIST")
                    ? "RECEPTION"
                    : user.roles.includes("NURSE")
                    ? "NURSE"
                    : "PARENT"}
                </Typography>
              }
              heading={`${user.firstName} ${user.lastName}`}
              subtitle={`DOB: ${user.dateOfBirth}, Email: ${
                user.email
              }, Roles: ${user.roles?.join(", ")}`}
              size="120px"
            />
          ))}
          <Stack />
          <Stack />
        </Stack>
      </Stack>
      <StyledDialog
        title={
          language == "English"
            ? `${selectedUser?.firstName} ${selectedUser?.lastName}'s Roles`
            : `Ko nga mahi a ${selectedUser?.firstName} ${selectedUser?.lastName}`
        }
        open={userDialogOpen}
        handleChange={() => setUserDialogOpen(false)}
        children={
          <Stack>
            <Stack spacing="18px" alignSelf="center" marginBottom="27px">
              <FormControlLabel
                label={language == "English" ? "Admin" : "Kaiwhakahaere"}
                control={
                  <Switch
                    checked={selectedUser?.roles?.includes("ADMIN")}
                    onChange={() => handleRoleChange("ADMIN")}
                  />
                }
              />
              <FormControlLabel
                label={language == "English" ? "Receptionist" : "Kai manaaki"}
                control={
                  <Switch
                    checked={selectedUser?.roles?.includes("RECEPTIONIST")}
                    onChange={() => handleRoleChange("RECEPTIONIST")}
                  />
                }
              />
              <FormControlLabel
                label={language == "English" ? "Nurse" : "Nehi"}
                control={
                  <Switch
                    checked={selectedUser?.roles?.includes("NURSE")}
                    onChange={() => handleRoleChange("NURSE")}
                  />
                }
              />
              <FormControlLabel
                label={
                  language == "English" ? "Data Analyst" : "Kaitatari Raraunga"
                }
                control={
                  <Switch
                    checked={selectedUser?.roles?.includes("DATA_ANALYST")}
                    onChange={() => handleRoleChange("DATA_ANALYST")}
                  />
                }
              />
              <FormControlLabel
                label={language == "English" ? "Parent" : "Matua"}
                control={<Switch checked disabled />}
              />
            </Stack>
            <StyledButton
              size="60px"
              disabled={disabled}
              children={
                <>
                  <Typography
                    textTransform="none"
                    sx={{
                      color: "background.paper",
                      mr: "18px",
                      ml: userLoading ? "18px" : "0px",
                    }}
                  >
                    {language == "English" ? "Save Changes" : "Tiaki Huringa"}
                  </Typography>
                  {userLoading && (
                    <CircularProgress
                      size="27px"
                      sx={{
                        color: "background.paper",
                        ml: "18px",
                      }}
                    />
                  )}
                </>
              }
              onClick={() => updateUser()}
            />
          </Stack>
        }
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        autoHideDuration={5000}
        ContentProps={{
          sx: {
            borderRadius: "18px",
            backgroundColor: error ? "error.main" : "primary.main",
            px: "36px",
            py: "9px",
          },
        }}
      />
    </Stack>
  );
}
