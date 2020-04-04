<script>
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).db

	let is_session_open = process.browser ? db.get('session.is_open').value() : false
	let s = undefined

	onMount(() => {
		if(is_session_open){
			//todo format date
			//todo add resume/close option
			let current = db.get('session.metadata').value()
			//alert(`A session is already opened since ${current.date_create}, do you want to resume it?`) 
			setPosSession()
		}
	})

	function open(create = true){
		if(create) createPosSession()
		is_session_open = true
	}

	function close(){
		let current_data = db.get('session').value()
		
		//TODO find a way to append cleanly
		let all = db.get('sessions').value()
		db.set('sessions', all.push(current_data)).write()
		db.set('session', {
			is_open: false
		}).write()
		is_session_open = false
	}

	/*
		s: a PosSession object
	*/
	function createPosSession(base = undefined){
		//TODO check if session objject is valid
		if(s !== undefined){
			db.set('session', s).write()
			s = base
			return 
		}

		let now =  Date.now()
		let m = {
			date_create: now,
			date_last_update: now,
			owner: $session.user.id
		}
		let newPos = {
			is_open: true,
			metadata: m,
			orders: []
		}

		db.set('session', newPos).write()
		s = newPos
		open(create=false)
	}

	function setPosSession(){
		s = db.get('session').value()
	}
</script>

{#if is_session_open}
	<slot></slot>
	<!-- todo: have this be a confirm button -->
	<button on:click={close} >close current session</button>
{:else}
	<div class="hero-body">	
		<div class="container">
			no session -> open one <br>
			<div class="card">
				<div class="card-content">
					<h1>cash control</h1>
					<!--
					TODO have a cash control setter component
					{#each cash_control as content }
						{content.value} |
						<button on:click={() => manageCash(content.value, false)}>-</button> {content.amount} <button on:click={() => manageCash(content.value, true)}>+</button><br>
					{/each} 
					-->
				</div>
			</div>
			<button class="button" on:click={open}>open a session</button>
		</div>
 	</div>
{/if}