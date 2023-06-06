import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeModal, openConfirmModal } from "@mantine/modals";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useState } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedData } from "../types/paginatedData";
import { Category as TCategory } from "../types/category";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { axiosPrivate } from "../api/axios";

const schema = z.object({
  id: z.number(),
  name: z.string(),
  color_id: z.number(),
});

export default function Category() {
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
    PaginatedData<TCategory>
  >({
    queryKey: ["categories", filters],
    queryFn: async ({ queryKey }: any) => {
      console.log(queryKey);
      const [_, { search, page, limit }] = queryKey;
      let url = `/categories?search=${search}&page=${page}&limit=${limit}`;
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
    mutationKey: ["add-category-mutation"],
    mutationFn: async (values: typeof form.values) => {
      const res = await axiosPrivate.post("/categories", values);
      const data = await res.data;
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      showNotification({
        title: "Category added successfully",
        message: data?.message,
      });
      setOpened(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["category"] });
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
    mutationKey: ["edit-category-mutation"],
    mutationFn: async (values: typeof form.values) => {
      const res = await axiosPrivate.put(
        "/categories/" + values.id,
        values
      );
      const data = await res.data;
      console.log(data);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      showNotification({
        title: "Category edited successfully",
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
      mutationKey: ["delete-category-mutation"],
      mutationFn: async (id: number) => {
        const res = await axiosPrivate.delete("/categories/" + id);
        const data = await res.data;
        console.log(data);
        return data;
      },
      onSuccess: (data) => {
        console.log(data);
        showNotification({
          title: "Category deleted successfully",
          message: data?.message,
        });
        setOpened(false);
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
    closeModal("delete-category-modal");
    console.log(deleteLoading);
  };

  const openDeleteModal = (id: number) =>
    openConfirmModal({
      modalId: "delete-category-modal",
      title: "Delete Category",
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
        title={form.values.id ? "Update Category" : "Add Category"}
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
              placeholder="Category Name"
              {...form.getInputProps("categoryName")}
            />
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
        <Title>Category</Title>
        <Group position="center">
          <Button onClick={() => setOpened(true)}>Add Category</Button>
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
          records={[
            {
              id: 1,
              categoryName: "Bus Operations",
            },
            {
              id: 2,
              categoryName: "Harassments",
            },
            {
              id: 3,
              categoryName: "security",
            },
            {
              id: 4,
              categoryName: "Harassments",
            },
            {
              id: 5,
              categoryName: "security",
            },
            {
              id: 6,
              categoryName: "Harassments",
            },
            {
              id: 7,
              categoryName: "Duration",
            },
            {
              id: 8,
              categoryName: "staff behavior",
            },
            {
              id: 9,
              categoryName: "security",
            },
            {
              id: 10,
              categoryName: "Bus Operations",
            },
          ]}
          columns={[
            { accessor: "categoryName" },
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
