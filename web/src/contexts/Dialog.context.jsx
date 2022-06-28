import { createContext, useState, useContext } from "react";

const DESTROY_TIMEOUT = 1000;

function generateId() {
	return Math.random().toString(32).substring(2);
}

const DialogContext = createContext(null);

export function DialogProvider({ children }) {

	const [ modals, setModals ] = useState([]);

	function show(ModalComponent, props) {
		const id = generateId();
		const modal = {
			id,
			Component: ModalComponent,
			props: props,
			visible: true
		}
		setModals(p => ([ ...p, modal ]));
		return id;
	}

	function remove(id) {
		setModals(p => p.filter(m => m.id !== id));
	}

	function close(id) {
		setModals(p => p.map(m => {
			if (m.id === id) {
				setTimeout(() => {
					remove(id)
				}, DESTROY_TIMEOUT);
				return { ...m, visible: false }
			}
			return m;
		}))
	}

	function confirm({ message, header, onSubmit }) {
		show(ConfirmDialog, { message, header, onSubmit })
	}

	function promptText({ header, defaultValue, onSubmit }) {
		show(TextDialog, { header, defaultValue, onSubmit })
	}

	return (
		<DialogContext.Provider
			value={{
				show,
				close,
				confirm,
				promptText
			}}
		>
			{ children }
			{ modals.map(({ Component, visible, id, props }) => <Component key={id} open={visible} close={() => close(id)} {...props} />) }
		</DialogContext.Provider>
	)
}

export default function useDialog() {
	const dialog = useContext(DialogContext);

	if (!dialog) {
		throw new Error('useDialog out of context!');
	}

	return dialog;
}