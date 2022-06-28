import { useCallback, useMemo, useState } from 'react'
import fetcher from '@/lib/fetcher'

function compileUrl(url, params = {}) {
	if (!params) {
		return url;
	}
	if (url.includes('{')) {
		for (const [ key, value ] of Object.entries(params)) {
			url = url.replace(`{${key}}`, value);
		}
	}
	return url;
}

function useFetcher(key) {

	const [ state, setState ] = useState({
		data: null,
		loading: false,
		err: null
	})

	const [ method, url ] = useMemo(() => {
		const parts = key.split(' ')
		if (parts.length == 1) {
			return [ 'GET', key ]
		} else {
			return parts
		}
	}, [ key ])

	const call = useCallback(async (body, params) => {
		try {
			setState(p => ({ ...p, loading: true, err: null }));
			const data = await fetcher(compileUrl(url, params), { method, body });
			setState(p => ({ ...p, loading: false, err: null }));
			return data;
		} catch (err) {
			setState(p => ({ ...p, loading: false, err }))
			throw err;
		}
	}, [ method, url ])

	const setErr = useCallback(async (err) => {
		setState(p => ({ ...p, err }))
	}, [])

	return { ...state, call, setErr }
}

export default useFetcher