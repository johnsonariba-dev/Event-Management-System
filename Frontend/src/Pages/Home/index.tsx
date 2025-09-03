

function Home() {
  return (
    <div>
      <div
        className="w-full h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/src/assets/images/hero.png)",
        }}
      >
        <div className="w-full p-4 flex items-center justify-center text-center">
          <h1 className="text-[96px] p-4 text-white">
            <span className="text-primary">Connect</span> through Unforgettable <span className="text-secondary">Events</span>{" "}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Home
