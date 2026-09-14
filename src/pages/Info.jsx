export default function Info() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 md:px-20 py-10">
      <div className="max-w-[520px] w-full grid gap-4">
        <h1 className="text-base">Info</h1>

        <section>
          <h2 className="text-xs uppercase text-accent mb-1">Jeanne Hébuterne</h2>
          <p className="text-muted">
            1898 to 1920. Painter. Met Amedeo Modigliani in Paris in 1917, aged 19. He painted
            her more than twenty times.
          </p>
          <p className="text-muted mt-1">
            He died on 24 January 1920. She died the next day. They are buried together at Père
            Lachaise.
          </p>
          <p className="text-muted mt-1">Each piece is named after one of his paintings of her.</p>
        </section>

        <section>
          <h2 className="text-xs uppercase text-accent mb-1">Silk</h2>
          <p className="text-muted">Spun and woven in Nepal. Cut and sewn in London.</p>
        </section>

        <section>
          <h2 className="text-xs uppercase text-accent mb-1">Contact</h2>
          <p>
            <a href="mailto:studio@hebuterne.co.uk" className="underline">
              studio@hebuterne.co.uk
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
