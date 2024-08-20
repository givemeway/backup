export const TOTPHTMLTemplate = (name, token) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2FA</title>

    <style>
      body {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        text-align: left;
        font-size: 1rem;
        font-weight: 500;
      }

      .title {
        width: 100%;
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        margin: 0px;

      }

      .icon-container {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 50px;
      }

      .email-body {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        width: 100%;
        line-height: 1.75rem;
      }

      .code-container {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .code {
        width: 120px;
        background: #e6e29d;
        color: black;
        font-weight: 600;
        font-size: 2rem;
        text-align: center;
        margin: 0;
      }

      .email-container {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        width: 100%;
        display: flex;
        height: auto;
        justify-content: flex-start;
        align-items: center;
      }

      .email-block {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        padding: 1rem;
        padding-top: 0px;
        border: 1px solid #f0f0f0;
        width: 50%;
      }

      .regards-container {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        display: flex;
        gap: 1rem;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }

      .regards-p {
        font-family: "Courier New", Courier, monospace;
        color: #404040;
        width: 100%;
        text-align: left;
        margin: 0;
      }

      @media screen and (max-width: 767px) {
        .email-block {
          width: 100%;
        }
      }

      @media screen and (min-width: 1200px) {
        .email-block {
          width: 40%;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-block">
        <div class="icon-container">
          <svg
            width="30"
            height="25"
            viewBox="0 0 30 25"
            xmlns="http://www.w3.org/2000/svg"
            style="background: #ffffff"
          >
            <path
              d="M7.70076 0.320312L0.478516 4.91332L7.70076 9.50633L14.9242 4.91332L22.1465 9.50633L29.3687 4.91332L22.1465 0.320312L14.9242 4.91332L7.70076 0.320312Z"
              fill="#0061FF"
            ></path>
            <path
              d="M7.70076 18.6925L0.478516 14.0994L7.70076 9.50633L14.9242 14.0994L7.70076 18.6925Z"
              fill="#0061FF"
            ></path>
            <path
              d="M14.9242 14.0994L22.1465 9.50633L29.3687 14.0994L22.1465 18.6925L14.9242 14.0994Z"
              fill="#0061FF"
            ></path>
            <path
              d="M14.9242 24.8164L7.70077 20.2234L14.9242 15.6304L22.1465 20.2234L14.9242 24.8164Z"
              fill="#0061FF"
            ></path>
          </svg>
        </div>
        <p class="title">Hi, ${name}</p>
        <p class="email-body">
          Someone recently requested a login for your QDrive account. If this
          was not you, the login was prevented. The verification code to sign
          into your QDrive account is:
        </p>

        <h2 class="code">${token}</h2>

        <p class="email-body">
          This code is usable once and valid for 5 minutes from the time of
          request. Do not share the code with anyone. For any further
          assistance, contact support.
        </p>
        <p class="regards-p">Regards,</p>
        <p class="regards-p">The QDrive Team</p>

      </div>
    </div>
  </body>
</html>
`;
};
