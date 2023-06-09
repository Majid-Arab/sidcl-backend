import {
  TextInput,
  Group,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  Grid,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { trpc } from "../src/utils/trpc";
import { z } from "zod";
import { showNotification } from "@mantine/notifications";

const schema = z.object({
  id: z.number(),
  site_id: z.string(),
  client_id: z.number(),
  project_name_id: z.number(),
});

type Site = z.infer<typeof schema>;
type Props = {
  opened: boolean;
  // open : () =>void;
  close: () => void;
  site: Partial<Site>;
};
export function AddFormModal({ opened, close, site }: Props) {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      id: 0,
      site_id: "",
      client_id: 0,
      project_name_id: 0,
    },
  });
  const handleSubmit = async (values: Site) => {};
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (site.site_id) {
      return form.setValues(site);
    }
    form.reset();
  }, [site]);

  return (
    <>
      <Modal
        title={site.site_id ? "Update Site" : "Add Site"}
        centered
        opened={opened}
        onClose={close}
        size="lg"
      >
        <form
          onSubmit={form.onSubmit(async (values) => (handleSubmit(values), ""))}
        >
          <Grid grow>
            <Grid.Col span={4}>
              <TextInput
                placeholder="Enter Site Id"
                withAsterisk
                // value={site.site_id ?? null}
                {...form.getInputProps("site_id")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                id="addClient"
                name="clients"
                placeholder="Pick one"
                data={[
                  { value: "13", label: "React" },
                  { value: "12", label: "Angular" },
                  { value: "14", label: "Vue" },
                  { value: "15", label: "Svelte" },
                ]}
                // value={site.client_id ?? null}
                {...form.getInputProps("client_id")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                id="addProject"
                name="projectName"
                placeholder="Pick one"
                // value={site.project_name_id ?? null}
                data={[
                  { value: "29", label: "React" },
                  { value: "20", label: "Angular" },
                  { value: "3", label: "Svelte" },
                  { value: "4", label: "Vue" },
                ]}
                {...form.getInputProps("project_name_id")}
              />
            </Grid.Col>
          </Grid>

          <Grid grow>
            <Grid.Col span={4}>
              <Input
                id="addSurveyourName"
                name="surveyourName"
                placeholder="Surveyour Name"
                radius="xs"
                {...form.getInputProps("addSurveyourName")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <DatePickerInput
                label="Pick date"
                placeholder="Pick date"
                value={value}
                onChange={setValue}
                mx="auto"
                maw={400}
              />
            </Grid.Col>
          </Grid>

          <Textarea
            name="description"
            placeholder="Your description"
            withAsterisk
            mt="8px"
            {...form.getInputProps("addDescription")}
          />

          <Button fullWidth mt="8px" type="submit">
            {site.site_id ? "Update Site" : "Add Site"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
