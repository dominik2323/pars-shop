import nodemailer from "nodemailer";

const wedosSettings = {
  host: "smtp-197158.m58.wedos.net",
  port: 587,
  secure: false,
  auth: {
    user: "dominik@tomczik.cz",
    pass: "Fa2f7wi9-",
  },
};

const parsSettings = {
  host: "mail2.parsdecin.cz",
  port: 587,
  secure: false,
  auth: {
    user: "eshop@parsdecin.local",
    pass: "ParsDecin2021**",
    // user: "kopirka@parsdecin.local",
    // pass: "ParsDecin01",
  },
  tls: {
    rejectUnauthorized: false,
  },
};


function createMailer(message: {
  to: string;
  from: string;
  subject: string;
  html: string;
}): Promise<any> {
  const transporter = nodemailer.createTransport(parsSettings);

  return new Promise((res, rej) =>
    transporter.sendMail(message, (err, info) =>
      err ? rej({ err }) : res({ info })
    )
  );
}

export default createMailer;
