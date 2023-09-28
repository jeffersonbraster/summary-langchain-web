"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import { Stars, Trash2, PencilLine, Loader2 } from "lucide-react";

const statusMessages = {
  waiting: "Perguntar à Vertex AI",
  generation: "Gerando..",
  success: "Sucesso!",
};

const statusMessagesNewBullet = {
  waiting: "Perguntar à Vertex AI",
  generation: "Gerando..",
  success: "Sucesso!",
};

export default function Home() {
  const [text, setText] = useState("");
  const [bullets, setBullets] = useState(3);
  const [status, setStatus] = useState("waiting");
  const [statusNewBullet, setStatusNewBullet] = useState("waiting");

  const [results, setResults] = useState([]);

  async function handleLangchainVertex(e) {
    e.preventDefault();

    setStatus("generation");

    const response = await api.post("/generate_summary/", {
      text,
      numBulletPoints: bullets,
    });

    setStatus("success");
    setResults(response.data);

    setTimeout(() => {
      setStatus("waiting");
    }, 5000);
  }

  const processedResults = results.map((result) => ({
    bullet: result.bullet.replace(/^\s*\*/, "").trim(),
  }));

  async function handleNewBulletPoint(index) {
    setStatusNewBullet("generation");
    const bullet = processedResults[index].bullet;

    const otherBulletsPoints = processedResults
      .filter((_, i) => i !== index)
      .map((result) => result.bullet);

    const response = await api.post("/generate_new_summary/", {
      text,
      bulletPoint: bullet,
      allBulletPoints: otherBulletsPoints,
    });

    if (response.data.length > 0) {
        const newBullet = response.data[0].bullet;

        const updatedResults = [...results];
        updatedResults[index] = { bullet: newBullet };

        setStatusNewBullet("success");
        setResults(updatedResults);
    } else {
        console.error('No bullet points returned from API');
    }

    setTimeout(() => {
      setStatusNewBullet("waiting");
    }, 2000);
  }

  return (
    <div className="max-w-[680px] bg-background mx-auto px-4 pt-12 pb-4 overflow-hidden">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl text-pistachio font-mono">Summary Article</h1>

        <button type="button">
          <Trash2 className="h-8 w-8 text-snow" strokeWidth={0.8} />
        </button>
      </header>

      <form onSubmit={() => {}} className="py-8 w-full flex flex-col text-foam">
        <label className="text-lg font-light" htmlFor="text">
          Cole seu texto aqui:
        </label>

        <textarea
          className="my-4 h-40 font-mono bg-blueberry-600 border border-blue-300 rounded-md px-4 py-3 outline-none focus-within:ring-1 focus-within:ring-lime-600"
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <label className="text-lg font-light" htmlFor="bullets">
          Quantos bullets você quer?
        </label>

        <input
          className="my-4 h-12 font-mono bg-blueberry-600 border border-blue-300 rounded-md px-4 py-3 outline-none focus-within:ring-1 focus-within:ring-lime-600"
          type="number"
          name="bullets"
          id="bullets"
          value={bullets}
          onChange={(e) => setBullets(e.target.value)}
        />

        <button
          data-success={status === "success"}
          disabled={status !== "waiting"}
          className="text-pistachio flex items-center justify-center rounded-lg border border-pistachio h-14 gap-2 data-[success=true]:bg-emerald-400 data-[success=true]:text-snow"
          type="submit"
          onClick={handleLangchainVertex}
        >
          {status === "waiting" ? (
            <>
              <Stars className="w-6 h-6" />
              Perguntar à Vertex AI
            </>
          ) : (
            statusMessages[status]
          )}
        </button>
      </form>

      <div className="mt-6">
        <span className="text-xl font-semibold text-foam">
          Bullets de Resumo:
        </span>
        <div className="my-4">
          {processedResults.map((result, index) => (
            <div key={index} className="mb-4 flex items-center">
              {" "}
              <p className="mt-1 text-foam font-light flex-grow">
                {result.bullet}
              </p>{" "}
              <button
                disabled={statusNewBullet !== "waiting"}
                className="px-4 py-2 ml-2 bg-gum-200 cursor-pointer bg-transparent rounded hover:bg-foam-dark"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewBulletPoint(index);
                }}
              >
                {statusNewBullet === "waiting" ? (
                  <PencilLine className="h-8 w-8 text-snow" strokeWidth={0.8} />
                ) : (
                  <Loader2 />
                )}
                
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
