/* Config file for aws authentication */
const awsconfigDev = {
  Auth: {
    region: "eu-west-1",
    identityPoolId: "eu-west-1:290e2bfc-0fb7-477d-b41b-8462e1852003",
    userPoolId: "eu-west-1_ViD3c2s7Y",
    userPoolWebClientId: "390j7gq8v3na9ba1v0nu9n87un",
  },
  Storage: {
    AWSS3: {
      bucket: "dev-co2monitor-webapp",
      region: "eu-west-1",
    }
  },
  // API: {
  //   endpoints: [
  //     {
  //       name: "AdminQueries",
  //       endpoint: "https://l246spdaxg.execute-api.eu-west-1.amazonaws.com/dev",
  //       region: "eu-west-1",
  //     },
  //     {
  //       name: "AE",
  //       endpoint: "https://4k9kvcgqp3.execute-api.eu-west-1.amazonaws.com/dev/CGAPI",
  //       region: "eu-west-1",
  //     },
  //   ],
  // },
};

export default awsconfigDev;





// {
//   "Version": "2008-10-17",
//     "Statement": [
//       {
//         "Sid": "2",
//         "Effect": "Allow",
//         "Principal": {
//           "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ETOKITB6GLV5T"
//         },
//         "Action": "s3:GetObject",
//         "Resource": "arn:aws:s3:::ae-web-app-dev/*"
//       },
//       {
//         "Sid": "3",
//         "Effect": "Allow",
//         "Principal": "*",
//         "Action": [
//           "s3:GetObject",
//           "s3:GetObjectAcl",
//           "s3:PutObject",
//           "s3:PutObjectAcl",
//           "s3:DeleteObject"
//         ],
//         "Resource": "arn:aws:s3:::ae-web-app-dev/public/images/*"
//       }
//     ]
// }



// [
//   {
//     "AllowedHeaders": [
//       "*"
//     ],
//     "AllowedMethods": [
//       "HEAD",
//       "GET",
//       "PUT",
//       "POST",
//       "DELETE"
//     ],
//     "AllowedOrigins": [
//       "*"
//     ],
//     "ExposeHeaders": [
//       "x-amz-server-side-encryption",
//       "x-amz-request-id",
//       "x-amz-id-2",
//       "ETag"
//     ],
//     "MaxAgeSeconds": 3000
//   }
// ]