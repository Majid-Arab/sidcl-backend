import {
    createStyles,
    Header,
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { ColorSchemeToggle } from './ColorSchemeToggle';
  
  const useStyles = createStyles((theme) => ({
    link: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      textDecoration: 'none',
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      fontWeight: 500,
      fontSize: theme.fontSizes.sm,
  
      [theme.fn.smallerThan('sm')]: {
        height: 42,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      },
  
      ...theme.fn.hover({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      }),
    },


  
    hiddenMobile: {
      [theme.fn.smallerThan('sm')]: {
        display: 'none',
      },
    },
  
    hiddenDesktop: {
      [theme.fn.largerThan('sm')]: {
        display: 'none',
      },
    },
  }));
  
 
  export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { classes, theme } = useStyles();
    const [login, setLogin] = useState(false)  
    return (
      <Box>

        {/* Navigation bar  */}
        <Header height={60} px="md">
          <Group position="apart" sx={{ height: '100%' }}>
            {/* <MantineLogo size={30} /> */}
  
            <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
              <a href="#" className={classes.link}>
                Site Info
              </a>
              <a href="#" className={classes.link}>
                Technical Proposal
              </a>
              <a href="#" className={classes.link}>
                Fesibility Report 
              </a>
              <a href="#" className={classes.link}>
                Project Info
              </a>
              <a href="#" className={classes.link}>
                Library Info
              </a>
              <a href="#" className={classes.link}>
                Employee Info
              </a>
            </Group>
  
            <Group className={classes.hiddenMobile}>
              <ColorSchemeToggle/>
              <Button variant="default" onClick={()=> setLogin(o => !o)}>{login == true ? 'Logout' : 'Login' }</Button>
            </Group>
  
            <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
          </Group>
        </Header>

        {/* Burger Button  */}
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          className={classes.hiddenDesktop}
          zIndex={1000000}
        >
          <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
            <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />
  
            <a href="#" className={classes.link}>
              Site Info
            </a>
            <a href="#" className={classes.link}>
              Technical Proposal
            </a>
            <a href="#" className={classes.link}>
              Fesibility Report
            </a>
            <a href="#" className={classes.link}>
              Project Info
            </a>
            <a href="#" className={classes.link}>
              Library Info
            </a>
            <a href="#" className={classes.link}>
              Employee Info
            </a>
  
            <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />
  
            <Group position="center" grow pb="xl" px="md">
              <Button variant="default">Log in</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
    );
  }