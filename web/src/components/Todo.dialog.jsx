import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useState } from "react";

function TodoDialog({ open, close, defaultData, onSubmit }) {

	const [ name, setName ] = useState(defaultData?.name ?? '');

	async function handleSubmit() {
		try {
			await onSubmit({ name });
			close();
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<Modal
			centered
			opened={open}
			onClose={() => close()}
		>
			<TextInput label="Name" value={name} onChange={e => setName(e.currentTarget.value)} />
			<Group position="right" className="mt-4">
				<Button variant="subtle" onClick={() => close()}>Cancel</Button>
				<Button onClick={() => handleSubmit()}>Ok</Button>
			</Group>
		</Modal>
	)

}

export default TodoDialog;