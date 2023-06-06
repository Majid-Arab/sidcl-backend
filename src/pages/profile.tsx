import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  Center,
  Avatar,
  Flex,
  Anchor,
  NumberInput,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export function UserProfile() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      address: "",
    },
    // validate: {
    //   name: (value) => value.trim().length < 2,
    //   email: (value) => !/^\S+@\S+$/.test(value),
    // },
  });

  return (
    <Center>
      <Box w={800}>
        <form onSubmit={form.onSubmit(() => {})}>
          <Title
            order={2}
            size="h1"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            })}
            weight={900}
            align="center"
          >
            Profile
          </Title>

          <Flex
            // mih={50}
            justify="center"
            align="center"
            direction="column"
          >
            <Avatar size={100} radius={10} />
            <Anchor size="xs">Change password</Anchor>
          </Flex>
          <SimpleGrid
            cols={2}
            mt="xl"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            <TextInput
              placeholder="Your name"
              name="name"
              variant="filled"
              {...form.getInputProps("name")}
            />
            <Box>
              <TextInput
                placeholder="Your email"
                name="email"
                variant="filled"
                {...form.getInputProps("email")}
              />
            </Box>
          </SimpleGrid>

          <SimpleGrid
            cols={2}
            mt="lg"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            <TextInput
              placeholder="Last name"
              name="lastName"
              variant="filled"
              {...form.getInputProps("lastName")}
            />
            <TextInput
              placeholder="User Name"
              name="userName"
              variant="filled"
              {...form.getInputProps("userName")}
            />
          </SimpleGrid>

          <SimpleGrid
            cols={2}
            mt="lg"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            <TextInput
              placeholder="City"
              name="city"
              variant="filled"
              {...form.getInputProps("city")}
            />
            <NumberInput
              placeholder="Zip Code"
              name="zipCode"
              variant="filled"
              {...form.getInputProps("zipCode")}
            />
          </SimpleGrid>

          <Textarea
            mt="md"
            placeholder="Your address"
            maxRows={10}
            minRows={5}
            autosize
            name="address"
            variant="filled"
            {...form.getInputProps("address")}
          />

          <Group position="right" mt="xl">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Center>
  );
}
