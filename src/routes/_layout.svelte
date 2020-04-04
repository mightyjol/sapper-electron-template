<script context="module">
	export async function preload(page, session){	
		if(page.path != '/pos') return this.redirect(302, '/pos')
	}
</script>

<script>
	import {onMount} from 'svelte'
	
	let isLoading = true

	onMount(() => {
		isLoading = false
	})
</script>

<style>
	/* :global(*:not(path):not(g)){
		color:                    hsla(210, 100%, 100%, 0.9) !important;
		background:               hsla(210, 100%,  50%, 0.5) !important;
		outline:    solid 0.25rem hsla(210, 100%, 100%, 0.5) !important;
	
		box-shadow: none !important;
	} */
</style>

<main>
	{#if isLoading}
		<div class="hero is-fullheight">
			<div class="hero-body">
				<div class="container">
					<div class="columns is-vcentered is-centered">
						<div class="column has-text-centered is-narrow">
							Loading...
						</div>
					</div>
				</div>	
			</div>
		</div>
	{:else}
		<slot></slot>
	{/if}
</main>