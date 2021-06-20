export const state = () => ({
  confirmDialog: {
    title: '',
    text: '',
    actions: [],
  },
})

export const mutations = {
  addConfirmDialog(state, dialog) {
    state.confirmDialog = dialog
  },
}
