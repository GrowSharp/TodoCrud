import ConfirmDialog from "@/components/Confirm.dialog";
import TodoDialog from "@/components/Todo.dialog";
import useDialog from "@/contexts/Dialog.context";
import useFetcher from "@/hooks/useFetcher";
import { ActionIcon, AppShell, Button, Checkbox, Divider, Header, Table, Text, TextInput } from "@mantine/core";
import { mdiFormatListChecks, mdiPencil, mdiTrashCan } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState } from "react";
import useSWR from "swr";

function HomePage() {

	const dialog = useDialog();
	const [ newTaskName, setNewTaskName ] = useState('');

	const { data, mutate: refresh } = useSWR('/api/todoItems');
	const createApi = useFetcher('POST /api/todoItems');
	const updateApi = useFetcher('PUT /api/todoItems/{id}');
	const deleteApi = useFetcher('DELETE /api/todoItems/{id}');

	async function handleCreate() {
		const newTask = {
			name: newTaskName,
		}
		await createApi.call(newTask);
		refresh();
		setNewTaskName('');
	}

	function handleDelete({ id }) {
		dialog.show(ConfirmDialog, {
			onSubmit: async (result) => {
				if (result) {
					await deleteApi.call(null, { id });
					refresh();
				}
			}
		})
	}

	function handleUpdate(originalTask) {
		dialog.show(TodoDialog, {
			defaultData: originalTask,
			onSubmit: async (newTask) => {
				const task = { ...originalTask, ...newTask };
				await updateApi.call(task, { id: task.id });
				refresh()
			}
		})
	}

	async function handleToggle(task) {
		await updateApi.call({ ...task, isDone: !task.isDone }, { id: task.id });
		refresh();
	}

	return (
		<AppShell
			header={
				<Header height={60} p="xs">
					<div className="flex items-center h-full gap-4">
						<Icon path={mdiFormatListChecks} size="2rem" />
						<Text className="text-xl">Todo - CRUD</Text>
					</div>
				</Header>
			}
		>
			<div className="flex items-center gap-4">
				<TextInput placeholder="Milk" className="flex-grow" value={newTaskName} onChange={e => setNewTaskName(e.currentTarget.value)} />
				<Button onClick={() => handleCreate()} loading={createApi.loading}>Add</Button>
			</div>
			<Divider className="my-4" />
			<Table striped highlightOnHover >
				<tbody>
					{
						data?.map(task => (
							<tr key={task.id}>
								<td width="1px"><Checkbox checked={task.isDone} onChange={() => handleToggle(task)} /></td>
								<td className={task.isDone ? 'line-through' : ''}>{task.name}</td>
								<td width="1px">
									<div className="flex gap-2">
										<ActionIcon variant="transparent" onClick={() => handleUpdate(task)}><Icon path={mdiPencil} /></ActionIcon>
										<ActionIcon variant="transparent" color="red" onClick={() => handleDelete(task)}><Icon path={mdiTrashCan} /></ActionIcon>
									</div>
								</td>
							</tr>
						))
					}
				</tbody>
			</Table>
		</AppShell>
	)
}

export default HomePage;