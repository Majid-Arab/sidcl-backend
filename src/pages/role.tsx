import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useState } from "react";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaginatedData } from "../types/paginatedData";
import { Role as MRole } from "../types/manager";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { axiosPrivate } from "../api/axios";

const schema = z.object({
  id: z.number(),
  name: z.string(),
});

export default function Role() {
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
  const { data, isLoading, refetch, isFetching } = useQuery<
    PaginatedData<MRole>
  >({
    queryKey: ["Roles", filters],
    queryFn: async ({ queryKey }: any) => {
      const [_, { search, page, limit }] = queryKey;
      let url = `/roles?search=${search}&page=${page}&limit=${limit}`;
      const res = await axiosPrivate.get(url);
      const data = await res.data;
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleFilter = (values: typeof initialFilterValues) => {
    setFilters((prev) => ({
      ...prev,
      ...values,
    }));
  };
  !isLoading;

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      id: 0,
      name: "",
    },
  });

  const { mutateAsync, isLoading: addLoading } = useMutation({
    mutationKey: ["add-role-mutation"],
    mutationFn: async (values: typeof form.values) => {
      const res = await axiosPrivate.post("/roles", values);
      const data = await res.data;
      return data;
    },
    onSuccess: (data) => {
      showNotification({
        title: "Role added successfully",
        message: data?.message,
      });
      setOpened(false);
      refetch();
    },
    onError: (data: AxiosError) => {
      if (data) {
        showNotification({
          message: "Something went wrong",
        });
      }
    },
  });

  const { mutateAsync: editMutateAsync, isLoading: editLoading } = useMutation({
    mutationKey: ["edit-role-mutation"],
    mutationFn: async (values: typeof form.values) => {
      const res = await axiosPrivate.put("/roles/" + values.id, values);
      const data = await res.data;

      return data;
    },
    onSuccess: (data) => {
      showNotification({
        title: "Role edited successfully",
        message: data?.message,
      });
      setOpened(false);
      refetch();
    },
    onError: (data: AxiosError) => {
      if (data) {
        showNotification({
          message: "Something went wrong",
        });
      }
    },
  });

  const { mutateAsync: deleteMutateAsync, isLoading: deleteLoading } =
    useMutation({
      mutationKey: ["delete-role-mutation"],
      mutationFn: async (id: number) => {
        const res = await axiosPrivate.delete("/roles/" + id);
        const data = await res.data;

        return data;
      },
      onSuccess: (data) => {
        showNotification({
          title: "Role deleted successfully",
          message: data?.message,
        });
        setOpened(false);
        refetch();
      },
      onError: (data: AxiosError) => {
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
      });
      return;
    }
    await mutateAsync(values);
  };

  const handleDelete = async (id: number) => {
    await deleteMutateAsync(id);
  };

  const openDeleteModal = (id: number) =>
    openConfirmModal({
      title: "Delete Role",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your profile? This action is
          destructive and you will have to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: "Delete Info", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        console.log(id);
        handleDelete(id);
        refetch();
      },
    });

  return (
    <>
      <Modal
        title={form.values.id ? "Update Role" : "Add Role"}
        centered
        size={378}
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
      >
        <Box sx={{ maxWidth: 340 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              withAsterisk
              placeholder="Role"
              {...form.getInputProps("name")}
            />
            <Button fullWidth mt={10} type="submit">
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
        <Title>Role</Title>
        <Group position="center">
          <Button onClick={() => setOpened(true)}>Add Role</Button>
        </Group>
      </Flex>

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
          // records={data?.data?.data}'
          records={[
            {
              id: 1,
              name: "Bus Operations",
            },
            {
              id: 2,
              name: "Harassments",
            },
            {
              id: 3,
              name: "security",
            },
            {
              id: 4,
              name: "Harassments",
            },
            {
              id: 5,
              name: "security",
            },
            {
              id: 6,
              name: "Harassments",
            },
            {
              id: 7,
              name: "Duration",
            },
            {
              id: 8,
              name: "staff behavior",
            },
            {
              id: 9,
              name: "security",
            },
            {
              id: 10,
              name: "Bus Operations",
            },
          ]}
          columns={[
            { accessor: "name" },
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
          fetching={isFetching}
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
