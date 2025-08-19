import { mount } from "svelte";
import "./app.css";
import Hedrite from "./Hedrite.svelte";

const app = mount(Hedrite, {
    target: document.getElementById("app")!,
});

export default app;
