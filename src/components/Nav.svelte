<script>
	export let segment;

	function openWindow(name){
		ipc.send('onpenWindow', {
			name: name
		})
	}
</script>

<style>
	li{
		display: inline-block;
	}
	a{
		display: block;
		padding: 10px 20px;
	}
	a:hover{
		background-color: #DDD;
	}
</style>

<nav>
	<ul>
		<li><a href='/shop/'>Home</a></li>
	</ul>
</nav>