<script>
	import { onMount } from 'svelte'
	import { stores } from '@sapper/app'

	let { session } = stores()
</script>

<nav class="navbar is-dark">
</nav>
<slot></slot>
