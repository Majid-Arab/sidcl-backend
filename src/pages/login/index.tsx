import {
  createStyles,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  rem,
  Anchor,
  Checkbox,
  PasswordInput,
  List,
  Center,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";
// import { ContactIconsList } from '../ContactIcons/ContactIcons';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 400,
    margin: "auto",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colors[theme.primaryColor][4]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md,
    padding: `calc(${theme.spacing.xl} * 2.5)`,

    [theme.fn.smallerThan("sm")]: {
      padding: `calc(${theme.spacing.xl} * 1.5)`,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: rem(300),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  social: {
    color: theme.white,

    "&:hover": {
      color: theme.colors[theme.primaryColor][1],
    },
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  control: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

const social = [IconBrandTwitter, IconBrandYoutube, IconBrandInstagram];

export function Login() {
  const { classes } = useStyles();

  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className={classes.social}
      variant="transparent"
    >
      <Icon size="1.4rem" stroke={1.5} />
    </ActionIcon>
  ));

  return (
    <Center maw="90%" h="850px" mx="auto">
      <div className={classes.wrapper}>
        <SimpleGrid
          cols={2}
          spacing={50}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <div>
            <h2 className={classes.title}>Government of Pakistan</h2>
            <Title className={classes.title}>
              Sindh Infrastructure Development Co. Ltd
            </Title>
            <h3 className={classes.title}>Complaint Management</h3>

            <List className={classes.description}>
              <List.Item>Standardize the complaints</List.Item>
              <List.Item>Workflow to Ensure Maximum</List.Item>
              <List.Item>Customer Satisfaction</List.Item>
            </List>

            <Text className={classes.description} mt="sm" mb={30}>
              Leverage the value of Customer Complaints for continuous
              improvements
            </Text>

            {/* <ContactIconsList variant="white" /> */}

            <Group mt="xl">{icons}</Group>
          </div>
          <div className={classes.form}>
            <Title
              order={2}
              // className={classes.title}
              ta="center"
              mt="md"
              mb={50}
            >
              Welcome back!
            </Title>

            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              classNames={{ input: classes.input, label: classes.inputLabel }}
            />
            <Checkbox label="Keep me logged in" mt="xl" size="md" />
            <Button fullWidth mt="xl" size="md">
              Login
            </Button>

            <Text ta="center" mt="md">
              Don&apos;t have an account?{" "}
              <Anchor<"a">
                href="#"
                weight={700}
                onClick={(event) => event.preventDefault()}
              >
                Register
              </Anchor>
            </Text>
          </div>
        </SimpleGrid>
      </div>
    </Center>
  );
}
