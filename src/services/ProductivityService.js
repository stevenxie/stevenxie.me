import APIClient from "./APIClient";

const ProductivityService = {
  async getProductivity() {
    const { data } = await APIClient.get("/productivity");
    return data;
  },
};

export default ProductivityService;
