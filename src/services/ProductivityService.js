import { client } from "@/api";

const ProductivityService = {
  async getProductivity() {
    const { data } = await client.get("/productivity");
    return data;
  },
};

export default ProductivityService;
