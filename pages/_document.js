import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&family=Nunito:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/imask/3.4.0/imask.min.js" crossorigin="anonymous"></script>
        </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
      </body>
    </Html>
  )
}
