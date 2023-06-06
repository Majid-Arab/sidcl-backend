import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeModal, openConfirmModal } from "@mantine/modals";
import {
  IconClearAll,
  IconClock,
  IconEdit,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useRef, useState } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedData } from "../types/paginatedData";
import { Complaint } from "../types/category";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { axiosPrivate } from "../api/axios";
import { DatePickerInput, DateTimePicker, TimeInput } from "@mantine/dates";

const schema = z.object({
  id: z.number(),
  name: z.string(),
  color_id: z.number(),
});

export default function Complaints() {
  const [value, setValue] = useState<Date | null>(null);
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

  const initialFilterValues = {
    limit: 10,
    page: 1,
    search: "",
  };
  const filterForm = useForm({
    initialValues: initialFilterValues,
  });

  const [filters, setFilters] = useState(initialFilterValues);
  const [opened, setOpened] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery<
    PaginatedData<Complaint>
  >({
    queryKey: ["complaints", filters],
    queryFn: async ({ queryKey }: any) => {
      console.log(queryKey);
      const [_, { search, page, limit }] = queryKey;
      let url = `/complaints?search=${search}&page=${page}&limit=${limit}`;
      const res = await axiosPrivate.get(url);
      const data = await res.data;
      return data;
    },
  });

  const handleFilter = (values: typeof initialFilterValues) => {
    setFilters((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      id: 0,
      name: "",
      color_id: 1,
    },
  });

  const { mutateAsync, isLoading: addLoading } = useMutation({
    mutationKey: ["add-complaint-mutation"],
    mutationFn: async (values: typeof form.values) => {
      const res = await axiosPrivate.post("/complaints", values);
      const data = await res.data;
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      showNotification({
        title: "Complaint added successfully",
        message: data?.message,
      });
      setOpened(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
    onError: (data: AxiosError) => {
      console.log(data);
      if (data) {
        showNotification({
          message: "Something went wrong",
        });
      }
    },
  });

  const { mutateAsync: editMutateAsync, isLoading: editLoading } = useMutation({
    mutationKey: ["edit-complaint-mutation"],
    mutationFn: async (values: typeof form.values) => {
      const res = await axiosPrivate.put("/complaints/" + values.id, values);
      const data = await res.data;
      console.log(data);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      showNotification({
        title: "Complaint edited successfully",
        message: data?.message,
      });
      setOpened(false);
      form.reset();
      refetch();
    },
    onError: (data: AxiosError) => {
      console.log(data);
      if (data) {
        showNotification({
          message: "Something went wrong",
        });
      }
    },
  });

  const { mutateAsync: deleteMutateAsync, isLoading: deleteLoading } =
    useMutation({
      mutationKey: ["delete-complaint-mutation"],
      mutationFn: async (id: number) => {
        const res = await axiosPrivate.delete("/complaints/" + id);
        const data = await res.data;
        console.log(data);
        return data;
      },
      onSuccess: (data) => {
        console.log(data);
        showNotification({
          title: "Complaint deleted successfully",
          message: data?.message,
        });
        setOpened(false);
        refetch();
        // queryClient.invalidateQueries({ queryKey: ["complaintTypes"] });
      },
      onError: (data: AxiosError) => {
        console.log(data);
        if (data) {
          showNotification({
            message: "Something went wrong",
          });
        }
      },
    });

  const handleSubmit = async (values: typeof form.values) => {
    if (form.values.id) {
      await editMutateAsync({
        id: values.id,
        name: values.name,
        color_id: values.color_id,
      });
      return;
    }
    await mutateAsync(values);
  };

  const handleDelete = async (id: number) => {
    console.log(deleteLoading);
    await deleteMutateAsync(id);
    refetch();
    closeModal("delete-complaint-modal");
    console.log(deleteLoading);
  };

  const openDeleteModal = (id: number) =>
    openConfirmModal({
      modalId: "delete-complaint-modal",
      title: "Delete Complaint",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your profile? This action is
          destructive and you will have to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: "Delete Info", cancel: "No don't delete it" },
      confirmProps: { color: "red", loading: deleteLoading },
      closeOnConfirm: false,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDelete(id),
    });

  return (
    <>
      <Modal
        title={form.values.id ? "Update Complaint" : "Add Complaint"}
        centered
        size="lg"
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
      >
        <Box mx="auto">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <SimpleGrid cols={2} my="sm">
              <DatePickerInput
                placeholder="Pick date"
                value={value}
                onChange={setValue}
                // mx="auto"
                maw={400}
              />
              <TimeInput
                ref={ref}
                rightSection={
                  <ActionIcon onClick={() => ref?.current.showPicker()}>
                    <IconClock size="1rem" stroke={1.5} />
                  </ActionIcon>
                }
              />
            </SimpleGrid>
            <SimpleGrid cols={2} my="sm">
              <TextInput
                withAsterisk
                placeholder="Fist Name"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                withAsterisk
                placeholder="Last Name"
                {...form.getInputProps("lastName")}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} my="sm">
              <TextInput
                withAsterisk
                placeholder="Email"
                {...form.getInputProps("email")}
              />
              <TextInput
                withAsterisk
                placeholder="Phone"
                {...form.getInputProps("phone")}
              />
            </SimpleGrid>
            <Textarea
              withAsterisk
              placeholder="Complaint Matter"
              {...form.getInputProps("complaintMatter")}
            />
            <SimpleGrid cols={2} my="sm">
              <Select
                placeholder="Category"
                data={[{ value: "1", label: "White" }]}
                {...form.getInputProps("category")}
              />
              <Select
                placeholder="Status"
                data={[{ value: "1", label: "White" }]}
                {...form.getInputProps("status")}
              />
            </SimpleGrid>
            <Button fullWidth mt={10} loading={addLoading} type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      <Flex
        mih={50}
        gap="xl"
        justify="space-between"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Title>Complaints</Title>
        <Group position="center">
          <Button onClick={() => setOpened(true)}>Add Complaint</Button>
        </Group>
      </Flex>

      <Accordion variant="separated" radius="md" defaultValue="filter" my={10}>
        <Accordion.Item value="filter">
          <Accordion.Control>Filter</Accordion.Control>
          <Accordion.Panel>
            <Grid grow>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  placeholder="Ticket Number"
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  placeholder="First Name"
                  {...form.getInputProps("firstName")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  placeholder="Email"
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  placeholder="Phone"
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  placeholder="Status"
                  data={[
                    { value: "1", label: "All Status" },
                    { value: "2", label: "Initiated" },
                    { value: "3", label: "In Process" },
                    { value: "4", label: "Resolved" },
                    { value: "5", label: "Pending" },
                  ]}
                  {...form.getInputProps("status")}
                />
              </Grid.Col>
            </Grid>
            <Center mt={10}>
              <Button leftIcon={<IconSearch />} m={5}>Search</Button>
              <Button leftIcon={<IconClearAll />} m={5}>Clear Search</Button>
            </Center>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <TextInput
        value={filters.search}
        placeholder="Search"
        mb={10}
        icon={<IconSearch size={16} />}
        onChange={(event) =>
          setFilters((prev) => ({ ...prev, search: event.currentTarget.value }))
        }
      />

      <Box sx={{ maxHeight: 520 }}>
        <DataTable
          withBorder
          records={[
            {
              ticket: 1,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 2,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 3,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 4,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 5,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 6,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 7,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 8,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 9,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
            {
              ticket: 10,
              incidentDate: "22-January-2022",
              incidentTime: "11:30pm",
              complaintDate: "10-January-2023",
              complaintTime: "11:30pm",
              firstName: "Faran",
              lastName: "Sadiq",
              email: "faransadiq@gmail.com",
              phone: "+9254863135",
              status: "?",
            },
          ]}
          columns={[
            { accessor: "ticket" },
            { accessor: "incidentDate" },
            { accessor: "incidentTime" },
            { accessor: "complaintDate" },
            { accessor: "complaintTime" },
            { accessor: "firstName" },
            { accessor: "lastName" },
            { accessor: "email" },
            { accessor: "phone" },
            { accessor: "status" },
            {
              accessor: "Action",
              width: 100,
              render: (record: any) => (
                <Group>
                  <ActionIcon
                    color="blue"
                    variant="light"
                    onClick={() => {
                      form.setValues(record);
                      setOpened(true);
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => {
                      openDeleteModal(record.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          totalRecords={data?.data?.meta?.total ?? 1}
          recordsPerPage={data?.data?.meta?.perPage ?? 1}
          page={data?.data?.meta?.currentPage ?? 1}
          onPageChange={(p) => setFilters((values) => ({ ...values, page: p }))}
          // fetching={isLoading || isFetching}
          recordsPerPageOptions={
            data?.data?.meta?.total! > 10 ? [10, 50, 100] : []
          }
          onRecordsPerPageChange={(e) =>
            setFilters((values) => ({ ...values, limit: e }))
          }
        />
      </Box>
    </>
  );
}
