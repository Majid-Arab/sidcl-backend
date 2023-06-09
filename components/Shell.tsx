import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Box,
  SegmentedControl,
} from "@mantine/core";
import { ColorSchemeToggle } from "./ColorSchemeToggle";
import { HeaderMegaMenu } from "./Header";
import  SideBar  from "./SideBar";
interface Props {
  children:React.ReactElement
}
export default function AppShellDemo({children}:Props) {
  const theme = useMantineTheme();
  const [userType, setUserType] = useState("admin");
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        userType === "admin" ? (
          <Navbar
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
          >
            <SideBar />
          </Navbar>
        ) : (
          <></>
        )
      }
      header={
        userType === "admin" ? (
          <Header height={{ base: 50 }} p="md">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>SIDCL Admin</Text>
              <SegmentedControl
                value={userType}
                onChange={setUserType}
                data={[
                  { label: "User", value: "user" },
                  { label: "Admin", value: "admin" },
                ]}
              />
              <Box>
                <ColorSchemeToggle />
              </Box>
            </div>
          </Header>
        ) : (
          <HeaderMegaMenu />
        )
      }
    >
      {children}
    </AppShell>
  );
}
