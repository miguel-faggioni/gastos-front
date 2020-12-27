<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-subheader>Prefix for dollar currency</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-text-field
          label="Amount"
          value="10.00"
          prefix="$"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-subheader>Suffix for weight</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-text-field
          label="Weight"
          value="28.00"
          suffix="lbs"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-subheader>Suffix for email domain</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-text-field
          label="Email address"
          value="example"
          suffix="@gmail.com"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-subheader>Suffix for time zone</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-text-field
          label="Label Text"
          value="12:30:00"
          type="time"
          suffix="PST"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- <template>
     <div class="hello">
     <h1>{{ msg }}</h1>

     <v-container fluid>
     <v-row>
     <v-col cols="4">
     <v-subheader>Prefix for dollar currency</v-subheader>
     </v-col>
     <v-col cols="8">
     <v-text-field
     label="Amount"
     value="10.00"
     prefix="$"
     ></v-text-field>
     </v-col>
     </v-row>
     </v-container>

     <p>
     For a guide and recipes on how to configure / customize this project,<br />
     check out the
     <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
     >vue-cli documentation</a
     >.
     </p>
     <h3>Installed CLI Plugins</h3>
     <ul>
     <li>
     <a
     href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
     target="_blank"
     rel="noopener"
     >babel</a
     >
     </li>
     <li>
     <a
     href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa"
     target="_blank"
     rel="noopener"
     >pwa</a
     >
     </li>
     <li>
     <a
     href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
     target="_blank"
     rel="noopener"
     >router</a
     >
     </li>
     <li>
     <a
     href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
     target="_blank"
     rel="noopener"
     >vuex</a
     >
     </li>
     <li>
     <a
     href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
     target="_blank"
     rel="noopener"
     >eslint</a
     >
     </li>
     </ul>
     <h3>Essential Links</h3>
     <ul>
     <li>
     <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
     </li>
     <li>
     <a href="https://forum.vuejs.org" target="_blank" rel="noopener"
     >Forum</a
     >
     </li>
     <li>
     <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
     >Community Chat</a
     >
     </li>
     <li>
     <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
     >Twitter</a
     >
     </li>
     <li>
     <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
     </li>
     </ul>
     <h3>Ecosystem</h3>
     <ul>
     <li>
     <a href="https://router.vuejs.org" target="_blank" rel="noopener"
     >vue-router</a
     >
     </li>
     <li>
     <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
     </li>
     <li>
     <a
     href="https://github.com/vuejs/vue-devtools#vue-devtools"
     target="_blank"
     rel="noopener"
     >vue-devtools</a
     >
     </li>
     <li>
     <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
     >vue-loader</a
     >
     </li>
     <li>
     <a
     href="https://github.com/vuejs/awesome-vue"
     target="_blank"
     rel="noopener"
     >awesome-vue</a
     >
     </li>
     </ul>
     </div>
     </template> -->

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
