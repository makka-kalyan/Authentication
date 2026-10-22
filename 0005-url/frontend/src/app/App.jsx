import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const dummyUrls = [
  {
    _id: 1,
    originalUrl:
      "https://www.amazon.in/OnePlus-Snapdragon-Segments-Complete-Personalized/dp/B0GRBBPBGQ/?_encoding=UTF8&pd_rd_w=6JrCI&content-id=amzn1.sym.2c54ac34-17ee-41af-96e6-864eff7c23cd&pf_rd_p=2c54ac34-17ee-41af-96e6-864eff7c23cd&pf_rd_r=Z48C9NNEGXWZKRF8CGHR&pd_rd_wg=JxUW0&pd_rd_r=c81cb94e-0b8e-4a50-9115-21bc74ef4704&ref_=pd_hp_d_r_btf_dealz_dotda_mz_rdfy",
    shortCode: "ASDFgr",
    clicks: 9,
  },
  {
    _id: 2,
    originalUrl:
      "https://www.amazon.in/OnePlus-Snapdragon-Segments-Complete-Personalized/dp/B0GRBBPBGQ/?_encoding=UTF8&pd_rd_w=6JrCI&content-id=amzn1.sym.2c54ac34-17ee-41af-96e6-864eff7c23cd&pf_rd_p=2c54ac34-17ee-41af-96e6-864eff7c23cd&pf_rd_r=Z48C9NNEGXWZKRF8CGHR&pd_rd_wg=JxUW0&pd_rd_r=c81cb94e-0b8e-4a50-9115-21bc74ef4704&ref_=pd_hp_d_r_btf_dealz_dotda_mz_rdfy",
    shortCode: "ASDFgr",
    clicks: 4,
  },
  {
    _id: 3,
    originalUrl:
      "https://www.amazon.in/OnePlus-Snapdragon-Segments-Complete-Personalized/dp/B0GRBBPBGQ/?_encoding=UTF8&pd_rd_w=6JrCI&content-id=amzn1.sym.2c54ac34-17ee-41af-96e6-864eff7c23cd&pf_rd_p=2c54ac34-17ee-41af-96e6-864eff7c23cd&pf_rd_r=Z48C9NNEGXWZKRF8CGHR&pd_rd_wg=JxUW0&pd_rd_r=c81cb94e-0b8e-4a50-9115-21bc74ef4704&ref_=pd_hp_d_r_btf_dealz_dotda_mz_rdfy",
    shortCode: "ASDFgr",
    clicks: 8,
  },
];

function App() {
  const [urls, setUrls] = useState(dummyUrls);
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);

  async function fetchUrls() {
    const response = await axios.get("http://localhost:5173/api/url");

    const responseData = response.data;

    setUrls(responseData.data.urls);

    console.log(responseData);
  }

  async function createShortUrl() {
    const response = await axios.post("http://localhost:5173/api/url", {
      url: inputValue,
    });

    setCurrentUrl({
      originalUrl: response.data.data.originalUrl,
      shortCode: response.data.data.shortCode,
    });

    fetchUrls();
  }

  async function deleteUrl(id) {
    await axios.delete(`http://localhost:5173/api/url/${id}`);

    fetchUrls();
  }

  useEffect(() => {
    fetchUrls();
  }, []);

  // fetchUrls();
  return (
    <>
      {/* <div>Hello</div> */}
      <main className="p-10 flex-col gap-4">
        <div className="w-full max-w-4xl p-2"></div>
        <div className="w-full max-w-4xl p-2">
          <input
            type="text"
            placeholder="Enter Long URL"
            value={inputValue}
            className="border rounded w-full p-2"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button
            className="rounded p-2 bg-orange-600 text-white cursor-pointer"
            onClick={createShortUrl}
          >
            Shorten
          </button>
        </div>
        <div className="w-full max-w-4xl p-2 flex flex-col gap-2">
          {urls.map((url) => {
            return (
              <div
                key={url._id}
                className="border gap-8 border-neutral-200 p-2 flex justify-evenly items-center"
              >
                <a
                  href={`http://localhost:3000/${url.shortCode}`}
                  target="_blank"
                >
                  {url.shortCode}
                </a>
                <p>{url.shortCode}</p>
                <p className="truncate">{url.originalUrl}</p>
                <p>{url.clicks}</p>
                <div className="flex gap-2">
                  <button className="p-2 rounded bg-orange-600 text-white cursor-pointer">
                    CPOY
                  </button>
                  <button
                    onClick={() => deleteUrl(url._id)}
                    className="p-2 rounded bg-orange-600 text-white cursor-pointer"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default App;
