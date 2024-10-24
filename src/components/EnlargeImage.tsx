export default function EnlargeImage({ src }: { src: string }) {
  function handleClick() {
    var background = document.createElement("div");
    background.className =
      "flex items-center justify-center bg-black bg-opacity-50 w-full h-screen absolute top-0 left-0 right-0 bottom-0 cursor-pointer z-[500] p-5";
    background.addEventListener("click", function () {
      document.body.removeChild(background);
    });

    var img = document.createElement("img");
    img.src = src;
    img.className = "border border-gray-200 dark:border-gray-800 rounded-lg";
    background.appendChild(img);

    document.body.appendChild(background);
  }

  return (
    <img
      className="border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer"
      src={src}
      onClick={handleClick}
    />
  );
}
