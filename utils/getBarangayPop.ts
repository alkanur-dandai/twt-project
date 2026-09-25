import barangayData from "@/data/brgyData.json";
  
  export const getBarangayPopulation = (
    name: string
  ) => {
    const data = barangayData.find(
      (item) =>
        String(item.Barangays).toLowerCase() ===
        name.toLowerCase()
    );

    return data?.Population ?? "0";
  };
