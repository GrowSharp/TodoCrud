import { Button, Group, Modal } from "@mantine/core";

function ConfirmDialog({ open, close, onSubmit }) {

	async function handleSubmit(data) {
		try {
			await onSubmit(data);
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
			title="Are you sure?"
		>
			<Group position="right">
				<Button variant="subtle" onClick={() => handleSubmit(false)}>Cancel</Button>
				<Button onClick={() => handleSubmit(true)}>Ok</Button>
			</Group>
		</Modal>
	)

}

export default ConfirmDialog;