<template>
<div class="y-watermark">
    <div class="y-watermark-content">
        <slot name="content"></slot>
        
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class WaterMark extends Vue {

}
</script>