<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Hedrite } from "./hedrite/hedrite";

    let container: HTMLDivElement;
    let hedrite: Hedrite | null = null;

    onMount(() => {
        hedrite = new Hedrite({ container });
    });

    onDestroy(() => {
        if (hedrite) {
            hedrite.dispose();
            hedrite = null;
        }
    });
</script>

<div bind:this={container} class="hedrite-container"></div>

<style>
    /* Make the container fill the parent */
    .hedrite-container {
        width: 100%;
        height: 100%;
    }
</style>
