<script>
  import data from "./data/5g.json";
  import { scaleSqrt } from "d3-scale";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { interpolate } from "d3-interpolate";
  import { onMount } from "svelte";

  const data2020 = data.filter(d => d.Year === 2020);
  const data2023 = data.filter(d => d.Year === 2023);
  const data2028 = data.filter(d => d.Year === 2028);

  let width = 700;
  $: height = width > 590 ? 350 : width > 470 ? 250 : 200;

  const margin = { top: 0, right: 10, bottom: 0, left: 50 };
  $: innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;

  const data_range = [25, 14000];
  let background_Color = "#555C70";

  $: rScale = scaleSqrt()
    .domain(data_range)
    .range(width > 590 ? [30, 300] : width > 470 ? [20, 200] : [15, 150]);

const x_pos = -45;
const y_pos = 45;

  // Single tweened store for animating current year data
  const tweenedPoints = tweened(data2020, {
    duration: 1500,
    easing: cubicOut,
    interpolate,
  });

  // States to control visibility of previous years
  let show2020 = true;
  let show2023 = false;
  let show2028 = false;

  let show2020text = true;
  let show2023text = false;
  let show2028text = false;

  // Keep static copies of previous years
  let static2020 = data2020;
  let static2023 = [];
  let static2028 = [];

  // Years in sequence for cycling
  const years = [2020, 2023, 2028];
  let index = 0;

  function getDataByYear(year) {
    if (year === 2020) return data2020;
    if (year === 2023) return data2023;
    if (year === 2028) return data2028;
    return [];
  }

  let currentYear = 2020;

  onMount(() => {
    function cycle() {
      index = (index + 1) % years.length;
      const year = years[index];
      const nextData = getDataByYear(year);
      currentYear = year;

      // Update visibility flags & static data for previous years
      if (year === 2020) {
        show2020 = false;
        show2023 = false;
        show2028 = false;
        static2020 = nextData;
        static2023 = [];
        static2028 = [];
        show2028text = false;

        setTimeout(() => {
        show2020text = true;
      }, 800); // 👈 label appears after 600ms

      } else if (year === 2023) {
        show2020 = true;
        show2023 = false;
        show2028 = false;
        static2023 = nextData;
        show2020text = false;
        
        setTimeout(() => {
        show2023text = true;
      }, 800);

      } else if (year === 2028) {
        show2020 = true;
        show2023 = true;
        show2028 = false;
        static2028 = nextData;
        show2023text = false;
        
        setTimeout(() => {
        show2028text = true;
      }, 800);

      }

      tweenedPoints.set(nextData);
      setTimeout(cycle, 3000); // loop every 4 seconds
    }

    setTimeout(cycle, 800); // start cycling after 4s
  });
</script>

<main>
      <div class="chart-container" bind:clientWidth={width}>
        <h1 class="heading-with-image">
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="https://images.wsj.net/im-81339499" class="heading-image" />
          Private 5G networks in <span transition:fade class="year-label">{currentYear}</span>
        </h1>
        <svg {width} {height}>
          <g class="inner-chart" transform="translate({margin.left}, {margin.top})">
             <!-- Current tweening year on top -->
             {#each $tweenedPoints as d}
             <rect
               x={d.Region === "North_America" ? x_pos : 0.5 * innerWidth}
               y={y_pos} 
               width={rScale(d.Value)}
               height={rScale(d.Value)}
               fill="none"
               stroke={background_Color}
               stroke-width = 2
               opacity="1"
             />
           {/each}
           {#each data as d}
           <rect
             x={d.Region === "North_America" ? x_pos : 0.5 * innerWidth}
             y={y_pos} 
             width={rScale(d.Value)}
             height={rScale(d.Value)}
             fill="none"
             stroke={background_Color}
             stroke-width = 2
             opacity="0.5"
             stroke-dasharray="1,4"
             stroke-linecap="round"
           />
         {/each}
            <!-- {#if show2020}
              {#each static2020 as d}
                <rect
                  x={d.Region === "North_America" ? x_pos : 0.5 * innerWidth}
                  y={y_pos}
                  width={rScale(d.Value)}
                  height={rScale(d.Value)}
                  fill={background_Color}
                  opacity="0.4"
                />
              {/each}
            {/if}

            {#if show2023}
              {#each static2023 as d}
                <rect
                  x={d.Region === "North_America" ? x_pos : 0.5 * innerWidth}
                  y={y_pos}
                  width={rScale(d.Value)}
                  height={rScale(d.Value)}
                  fill={background_Color}
                  opacity="0.4"
                />
              {/each}
            {/if}

            {#if show2028}
              {#each static2028 as d}
                <rect
                  x={d.Region === "North_America" ? x_pos : 0.5 * innerWidth}
                  y={y_pos}
                  width={rScale(d.Value)}
                  height={rScale(d.Value)}
                  fill="#F06394"
                  opacity="0.4"
                />
              {/each}
            {/if} -->
            <text
            class="text-lables"
            x={x_pos}
            y={y_pos - 10}
            style="font-size: {width < 350 ? '11px' :  '13px'};"
            >
            North America
            </text>
            <text
            class="text-lables"
            x={0.5 * innerWidth}
            y={y_pos - 10}
            style="font-size: {width < 350 ? '11px' : '13px'};"
            >
            China
            </text>

            {#if show2020text}
            <text
            class="text-lables"
            x={x_pos + rScale(25) + 10}
            y={y_pos + rScale(25) / 2 + 5}
            style="font-size: {width < 350 ? '13px' :  '15px'};"
            transition:fade={{ duration: 600 }}
            >
           25
            </text>
            <text
            class="text-lables"
            x={0.5 * innerWidth + rScale(25) + 15}
            y={y_pos + rScale(25) / 2 + 5}
            style="font-size: {width < 350 ? '13px' : '15px'};"
            transition:fade={{ duration: 600 }}
            >
            60
            </text>
            {/if}

            {#if show2023text}
            <text
            class="text-lables"
            x={x_pos + rScale(330) + 10}
            y={y_pos + rScale(330) / 2 + 5}
            style="font-size: {width < 350 ? '13px' :  '15px'};"
            transition:fade={{ duration: 600 }}
            >
           330
            </text>
            <text
            class="text-lables"
            x={0.5 * innerWidth + rScale(850) + 15}
            y={y_pos + rScale(850) / 2 + 5}
            style="font-size: {width < 350 ? '13px' : '15px'};"
            transition:fade={{ duration: 600 }}
            >
            850
            </text>
            {/if}

            {#if show2028text}
            <text
            class="text-lables"
            x={2 * x_pos + rScale(4000)}
            y={y_pos + rScale(4000) / 2 + 5}
            style="font-size: {width < 350 ? '13px' :  '15px'};"
            transition:fade={{ duration: 600 }}
            >
            4,000
            </text>
            <text
            class="text-lables"
            x={0.5 * innerWidth + x_pos + rScale(14000) - 10}
            y={y_pos + rScale(14000) / 2 + 5}
            style="font-size: {width < 350 ? '13px' : '15px'};"
            transition:fade={{ duration: 600 }}
            >
            14,000
            </text>
            {/if}
          </g>
        </svg>
        <p class="footnote">Note: 2028 figures are forecasted. <br>Source: Analysys Mason</p>
      </div>
</main>

<style>

  main {
    max-width: 700px;
    margin: 20px auto;
  }
 
  h1{
    color: #333333;
    font-family: Retina, sans-serif;
    font-size: 18px;
    font-weight: 500;
    margin-bottom:4px;
    line-height: 20px;
    text-transform: uppercase;
    }

  .heading-with-image {
  display: flex;
  align-items: center;
  gap: 4px; /* space between image and text */
}

.heading-image {
  width: 45.0879px;
  height: 45.0879px;
  display: inline-block;
  vertical-align: middle;
}

@media (max-width: 355px) {
  .heading-image {
    width: 38.8442px;
    height: 38.8442px;
  }
  h1{
    font-size: 16px;
  }
}


  .text-lables{
      font-family: Retina, sans-serif;
      text-transform: uppercase;
    }

  .year-label{
    color: #333333;
    font-family: Retina, sans-serif;
    font-size: 28px;
    font-weight: 500;
    margin-left:1px;
  }

  .footnote{
    color: #727272;
    font-weight: 300;
    font-family: Retina, sans-serif;
    font-size: 13px;
    line-height: 17px;
    margin-top:4px;
  }
</style>
