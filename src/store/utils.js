export const createLoadableState = (initial = null) => ({
  data: initial,
  loading: false,
  error: null,
});

export const createLoadableMutations = ({
  loadingName,
  successName,
  failureName,
}) => ({
  [loadingName]: state => (state.loading = true),
  [successName]: (state, data) => {
    state.data = data;
    state.error = null;
    state.loading = false;
  },
  [failureName]: (state, error) => {
    state.error = error;
    state.aboutLoading = false;
  },
});
