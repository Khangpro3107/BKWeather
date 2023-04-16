import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Bar, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title,
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title
);

// const getOrCreateTooltip = (chart) => {
//   let tooltipEl = chart.canvas.parentNode.querySelector('div');

//   if (!tooltipEl) {
//     tooltipEl = document.createElement('div');
//     tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
//     tooltipEl.style.backgroundImage = "url(../src/assets/Logo.png)"
//     tooltipEl.style.borderRadius = '3px';
//     tooltipEl.style.color = 'white';
//     tooltipEl.style.opacity = 1;
//     tooltipEl.style.pointerEvents = 'none';
//     tooltipEl.style.position = 'absolute';
//     tooltipEl.style.transform = 'translate(-50%, 0)';
//     tooltipEl.style.transition = 'all .1s ease';

//     const table = document.createElement('table');
//     table.style.margin = '0px';

//     tooltipEl.appendChild(table);
//     chart.canvas.parentNode.appendChild(tooltipEl);
//   }

//   return tooltipEl;
// };

// const externalTooltipHandler = (context) => {
//   // Tooltip Element
//   const {chart, tooltip} = context;
//   const tooltipEl = getOrCreateTooltip(chart);

//   // Hide if no tooltip
//   if (tooltip.opacity === 0) {
//     tooltipEl.style.opacity = 0;
//     return;
//   }

//   // Set Text
//   if (tooltip.body) {
//     const titleLines = tooltip.title || [];
//     const bodyLines = tooltip.body.map(b => b.lines);

//     const tableHead = document.createElement('thead');

//     titleLines.forEach(title => {
//       const tr = document.createElement('tr');
//       tr.style.borderWidth = 0;

//       const th = document.createElement('th');
//       th.style.borderWidth = 0;
//       const text = document.createTextNode(title);

//       th.appendChild(text);
//       tr.appendChild(th);
//       tableHead.appendChild(tr);
//     });

//     const tableBody = document.createElement('tbody');
//     bodyLines.forEach((body, i) => {
//       const colors = tooltip.labelColors[i];

//       const span = document.createElement('span');
//       span.style.background = colors.backgroundColor;
//       span.style.borderColor = colors.borderColor;
//       span.style.borderWidth = '2px';
//       span.style.marginRight = '10px';
//       span.style.height = '10px';
//       span.style.width = '10px';
//       span.style.display = 'inline-block';

//       const tr = document.createElement('tr');
//       tr.style.backgroundColor = 'inherit';
//       tr.style.borderWidth = 0;

//       const td = document.createElement('td');
//       td.style.borderWidth = 0;

//       const text = document.createTextNode(body);

//       td.appendChild(span);
//       td.appendChild(text);
//       tr.appendChild(td);
//       tableBody.appendChild(tr);
//     });

//     const tableRoot = tooltipEl.querySelector('table');

//     // Remove old children
//     while (tableRoot.firstChild) {
//       tableRoot.firstChild.remove();
//     }

//     // Add new children
//     tableRoot.appendChild(tableHead);
//     tableRoot.appendChild(tableBody);
//   }

//   const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

//   // Display, position, and set styles for font
//   tooltipEl.style.opacity = 1;
//   tooltipEl.style.left = positionX + tooltip.caretX + 'px';
//   tooltipEl.style.top = positionY + tooltip.caretY + 'px';
//   tooltipEl.style.font = tooltip.options.bodyFont.string;
//   tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
// };

function App() {
  const [allData, setAllData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateTime, setUpdateTime] = useState(null);
  useEffect(() => {
    const fetchAPI = async () => {
      setIsLoading(true);
      const lat = 10.762622;
      const lon = 106.660172; // hcm city
      const key = "your key here";
      const units = "metric";
      const res = await fetch(
        `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`
      );
      // const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`)
      setUpdateTime(new Date().toString());
      const rawData = await res.json();
      console.log(rawData);
      setAllData(rawData.list.slice(0, 24));
      console.log(
        rawData.list.map((item) => (item.main.rain ? item.rain["1h"] : 0))
      );
      setTemperatureData(rawData.list.map((item) => item.main.temp));
      setRainData(
        rawData.list.map((item) => (item.rain ? item.rain["1h"] : 0))
      );
      setIsLoading(false);
    };
    fetchAPI();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Thời tiết dự báo theo giờ ở TP.HCM",
        position: "top",
      },
    },
    scales: {
      temp: {
        position: "left",
      },
      rain: {
        position: "right",
      },
    },
  };

  const displayData = {
    labels: allData?.map((item) => item.dt_txt.slice(10, 16)),
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        type: "line",
        data: temperatureData,
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 1,
        yAxisID: "temp",
      },
      {
        label: "Lượng mưa 1 giờ qua (mm)",
        type: "bar",
        data: rainData,
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1,
        yAxisID: "rain",
        datalabels: {
          display: true,
        },
      },
    ],
  };

  const primaryNews = [
    {
      title: "Nhiệt độ thời điểm 12h ở Hồ Chí Minh vượt ngưỡng 36°C",
      summary:
        "Nhiệt độ ở Thành phố Hồ Chi Minh đang rất cao khiến cho nhiều người già và trẻ em nhập viện. Nhớ cung cấp nước cho cơ thể bạn nhé!",
      others: ["Hãy tránh nắng", "Không ra đường", "Hạ thân nhiệt"],
      image: "../src/assets/Map.png",
    },
    {
      title:
        "Nhiều người già và trẻ em ở Thành phố Hồ Chí Minh nhập viện vì nắng nóng",
      summary:
        "Do thời tiết dần chuyển sang mùa hạ mang theo không khí nóng đến đột ngột khiến cho nhiều người không kịp thích nghi đặc biệt là người già và trẻ em. Hiện nay bệnh viện vẫn đang tiếp nhận nhiều bệnh nhân tới vì sốc nhiệt.",
      image: "../src/assets/Map.png",
    },
    {
      title: "Dự kiến nắng nóng kéo dài ở Thành phố Hồ Chí Minh",
      summary:
        "Theo dự báo nhiệt độ ở Thành phố Hồ Chính Minh sẽ dao động từ 26°C đến 38°C từ tháng 4 đến tháng 8 năm 2023.  Mọi người nên cố gắng giữ gìn sức khỏe và sử dụng các biện pháp chống nắng, tránh ra ngoài vào buổi trưa nếu không cần thiết.",
      image: "../src/assets/Map.png",
    },
  ];

  const otherNews = [
    {
      title: "Dự thảo luật Đất đai liệt kê các trường hợp được thu hồi đất",
      image: "../src/assets/Map.png",
      link: "https://vnexpress.net/du-thao-luat-dat-dai-liet-ke-cac-truong-hop-duoc-thu-hoi-dat-4590373.html",
    },
    {
      title: "Dự thảo luật Đất đai liệt kê các trường hợp được thu hồi đất",
      image: "../src/assets/Map.png",
      link: "https://vnexpress.net/lao-dong-mat-viec-tang-4590392.html",
    },
    {
      title: "Tượng cánh tay trên bờ biển Hải Tiến gây tranh cãi",
      image: "../src/assets/Map.png",
      link: "https://vnexpress.net/tuong-canh-tay-tren-bo-bien-hai-tien-gay-tranh-cai-4589908.html",
    },
  ];

  const footerTexts = [
    {
      title: "Sản phẩm",
      texts: ["Website", "Thiết kế"],
    },
    {
      title: "Nguồn",
      texts: ["Hình ảnh TP Hồ Chí Minh", "Báo VNEpress", "OpenWeather"],
    },
    {
      title: "BK Weather",
      texts: [
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
        "Item 5",
        "Item 6",
        "Item 7",
      ],
    },
  ];

  const footerIcons = [
    "../src/assets/twitter.png",
    "../src/assets/facebook.webp",
    "../src/assets/instagram.png",
    "../src/assets/linkedin.png",
    "../src/assets/github.png",
  ];

  return (
    <div className="container mx-auto w-full max-w-full h-fit bg-[#21313A] flex flex-col items-center">
      <div className="container mt-2 h-[5rem] max-w-full">
        <img src="../src/assets/Logo.png" className="h-[6rem] ml-10" />
      </div>
      <div className="container w-2/5 h-[10rem] flex flex-col justify-between items-center max-w-full">
        <h1 className="text-5xl font-bold text-[#E5E5E5]">BK Weather</h1>
        <p className="text-[#E5E5E5] text-xl">
          Trang web xem thời tiết số 1 Việt Nam
        </p>
        <button className="rounded-2xl bg-[#3A5E72] text-[#E5E5E5] h-fit w-fit ps-3 pe-3 pt-2 pb-2">
          Tìm hiểu thêm
        </button>
      </div>
      <div className="container w-[100vw] mt-5 relative max-w-full">
        <div className="container absolute h-[3rem] w-[18rem] rounded-3xl bg-[#24343D] flex flex-row justify-between items-center p-4 top-1.5 right-1.5">
          <p className="text-white text-xl font-thin">Ho Chi Minh, Vietnam</p>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <img src="../src/assets/Map.png" className="w-full" />
      </div>
      <h1 className="text-white font-bold text-4xl mt-8 mb-4">
        Thời tiết dự báo trong ngày ở TP.HCM
      </h1>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="container w-4/5 bg-[#f0f0f0] mt-2">
            <Chart options={options} data={displayData} />
          </div>
          <p className="text-white w-2/3 text-center text-sm mt-5">{`Cập nhật lần cuối vào lúc ${updateTime}. Thông tin thời tiết được cung cấp bởi OpenWeather`}</p>
          <a
            className="text-white w-2/3 text-center text-sm hover:text-sky-500"
            href="https://openweathermap.org"
          >
            https://openweathermap.org
          </a>
        </>
      )}
      <div className="container mt-10 flex flex-col w-2/3 items-center">
        {primaryNews.map((item, index) => (
          <div
            className="container max-w-full h-[20rem] flex flex-row justify-between items-center"
            key={item.title}
          >
            <div className="container w-1/2 flex flex-col items-start justify-between gap-y-3">
              <h6 className="text-3xl text-white font-bold">{item.title}</h6>
              <p className="text-white">{item.summary}</p>
              <ul className="container flex flex-col w-4/5 self-center justify-start">
                {item.others
                  ? item.others.map((otherItem) => (
                      <div className="container flex flex-row items-center justify-start w-2/5">
                        <FontAwesomeIcon icon={faCheck} color="green" />
                        <li key={otherItem} className="text-white ml-2">
                          {otherItem}
                        </li>
                      </div>
                    ))
                  : null}
              </ul>
            </div>
            <img src={item.image} className="w-2/5 object-cover" />
          </div>
        ))}
      </div>
      <div className="container mt-10 flex flex-col w-3/4 items-center gap-y-2">
        <h6 className="text-white text-4xl font-bold">Tin tức khác</h6>
        <div className="container w-full h-[20rem] justify-between items-center flex flex-row">
          {otherNews.map((item) => (
            <a
              className="container flex flex-col justify-between items-center w-[30%] h-full gap-x-2 bg-[#25282C] py-2 px-6"
              key={item.title}
              href={item.link}
            >
              <img src={item.image} className="h-4/5 object-cover" />
              <h6 className="text-xl text-white font-semibold">{item.title}</h6>
            </a>
          ))}
        </div>
      </div>
      <div className="container mt-10 flex flex-row max-w-full p-10 bg-[#3A5E72] justify-between">
        <div className="container flex flex-col w-2/5">
          <h6 className="font-bold text-2xl text-white">BKWEATHER</h6>
          <p className="text-semibold text-lg text-white">
            Hãy nhập địa chỉ Email và tham gia cùng chúng tôi!
          </p>
        </div>
        <div className="container flex flex-row w-1/2 items-center justify-between">
          <input
            type="text"
            className="focus:outline-none border-2 rounded-sm border-[#8D8DFF] bg-[#4B4ACF] h-2/3 p-2 w-3/4 text-[#ABABFF]"
            placeholder="Địa chỉ Email của bạn..."
          />
          <button className="rounded-sm bg-[#F4F4FF] h-2/3 w-1/5 text-[#3A5E72]">
            Đăng ký
          </button>
        </div>
      </div>
      <div className="container mt-10 flex flex-row p-5 h-[20rem] justify-between">
        <div className="container w-[15%] flex flex-col justify-end">
          <img src="../src/assets/Logo.png" className="w-[90%]" />
        </div>
        <div className="container w-3/5 h-full flex flex-col items-end px-10">
          <div className="container w-full h-[90%] flex flex-row justify-between items-center">
            
              {footerTexts.map((item) => (
                <div className="container w-[30%] flex flex-col justify-start gap-y-2 h-full" key={item.title}>
                  <h6 className="font-bold text-white text-sm">{item.title}</h6>
                  {item.texts.map((text, index) => (
                    <p
                      className="text-white font-thin text-sm"
                      key={text + index}
                    >
                      {text}
                    </p>
                  ))}
                </div>
              ))}
            
          </div>
          <div className="container flex flex-row justify-end items-center h-[15%] gap-x-5 w-4/5 self-center">
            {footerIcons.map((icon) => (
              <img src={icon} className="h-full opacity-60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
