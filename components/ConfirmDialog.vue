<template>
  <v-dialog v-model="showDialog" max-width="300px">
    <v-card>
      <v-card-title>{{ dialog.title }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-6">{{ dialog.text }}</v-card-text>
      <v-card-actions v-if="dialog.actions && dialog.actions.length > 0">
        <v-spacer></v-spacer>
        <v-btn
          v-for="(action, index) in dialog.actions"
          :key="index"
          outlined
          @click="invokeCallback(action.callback)"
          >{{ action.label }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showDialog: false,
    }
  },
  computed: mapState({
    dialog: (state) => state.dialog.confirmDialog,
  }),
  watch: {
    dialog(val) {
      if ((val.title, val.text)) {
        this.showDialog = true
      }
    },
  },
  methods: {
    invokeCallback(callback) {
      if (callback) callback()
      this.showDialog = false
    },
  },
}
</script>
