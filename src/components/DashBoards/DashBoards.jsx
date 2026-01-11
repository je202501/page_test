import React from 'react';
import { getAdmin } from '../service/adminService';

import {
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Divider, Col, Row, Input, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import axios from 'axios';

import ModalLayout from '../ModalLayout';
import Title from '../Title';
// 날짜를 'YYYY.M.D' 형식으로 포맷팅
const formatDate = (date) => {
  if (!date) return '';
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};
/**
 * 날짜 입력 필드 형식
 */
const formatDateForInput = (date) => {
  if (!(date instanceof Date)) return '';
  const pad = (num) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// 커스텀 툴팁 (각 데이터의 createdAt 기준 7일 범위 표시)
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  // 현재 데이터 포인트의 createdAt 날짜
  const currentDate = new Date(payload[0].payload.time);
  // 7일 전 날짜 계산
  const sevenDaysAgo = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  return (
    <div
      style={{
        background: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color }}>
          {`${item.name}: ${item.value}`}
        </p>
      ))}
    </div>
  );
};

const DashBoards = (props) => {
  const auth = localStorage.getItem('token');
  /* Init */
  const { type } = props;
  /* State */
  const [chooseAdmin, setChooseAdmin] = React.useState(null);
  const [adminList, setAdminList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [searchProjectKeyword, setSearchProjectKeyword] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchProjects, setSearchProjects] = React.useState([]);
  const [selectedRefrigerator, setSelectedRefrigerator] = React.useState(null);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState(formatDateForInput(new Date()));
  const [chartData, setChartData] = React.useState([]);
  const [metod, setMetod] = React.useState('');

  /* Function */
  /**
   * null 검사
   */
  const isNull = (data) => {
    if (
      !data ||
      data === '' ||
      data === null ||
      data === undefined ||
      data === 'undefined' ||
      data === 'NONE' ||
      data.length < 1 ||
      Object.keys(data).length < 1
    ) {
      return true;
    } else {
      return false;
    }
  };
  /**-------------------------
   * 업체 선택 함수
   * -------------------------
   */
  const handleClickAdmin = async (admin) => {
    setLoading(true);
    try {
      const { status, data, message } = await getAdmin();
      if (status !== 200) throw { message };
      setChooseAdmin(admin);
      setServices(data);
      setTimeout(() => {
        setLoading(false);
      }, 550);
    } catch (e) {
      setLoading(false);
    }
  };

  /**-------------------------
   * 업체 검색
   * -------------------------
   */
  const handleSearchProject = async () => {
    setSearchLoading(true);
    try {
      if (isNull(searchProjectKeyword)) {
        MessageAlert.warning('내용을 입력해주세요');
        return;
      }
      const { status, message, data } = await getAdmin();
      if (status !== 200) throw { message };
      setSearchProjects(
        data.filter((i) => i.admin_name.indexOf(searchProjectKeyword) >= 0)
      );
      setTimeout(() => {
        setSearchLoading(false);
      }, 350);
    } catch (e) {
      setSearchLoading(false);
      console.log('[Portal][handleSearchProject] Error: ', e);
      MessageAlert.error(e.message);
    }
  };

  const handleClickAppendArea = () => {
    setIsOpenModal(true);
  };
  /**
   * ========
   * 데이터 조회 함수
   * ========
   */
  const fetchData = async (item) => {
    const now = new Date();
    const twentyFourHoursAgo = formatDateForInput(
      new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );
    const oneWeekAgo = formatDateForInput(
      new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    const oneMonthAgo = formatDateForInput(
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    );

    if (!chooseAdmin) return;

    // 지역 변수로 날짜와 메소드 결정
    const start =
      type === 'day'
        ? twentyFourHoursAgo
        : type === 'hour'
        ? oneWeekAgo
        : type === 'month'
        ? oneMonthAgo
        : twentyFourHoursAgo;

    const apiMethod =
      type === 'day'
        ? 'temperature'
        : type === 'hour'
        ? 'yeartemp/day'
        : type === 'month'
        ? 'yeartemp/year'
        : 'temperature';

    setStartDate(start);
    setMetod(apiMethod);
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}:${
          import.meta.env.VITE_SERVER_PORT
        }/api/${apiMethod}`,
        {
          params: {
            refrigerator_id: item.refrigerator_id,
            start_date: start,
            end_date: endDate,
          },
        }
      );
      const sortedData = [...response.data.data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      // 컬럼명을 type별로 매핑
      const columnMapping = {
        day: {
          temperature: 'temperature_value',
          outTemperature: 'out_temperature_value',
          settingTemp: 'setting_temp_value',
          current: 'current_value',
        },
        hour: {
          temperature: 'day_temp_value', // 예시, 실제 컬럼명에 맞게
          outTemperature: 'out_day_temp_value',
          settingTemp: 'setting_day_temp_value',
          current: 'day_current_value',
        },
        month: {
          temperature: 'year_temp_value',
          outTemperature: 'out_year_temp_value',
          settingTemp: 'setting_year_temp_value',
          current: 'year_current_value',
        },
      };
      const mapping = columnMapping[type] || columnMapping['day'];
      const formattedData = sortedData.map((entry) => ({
        time: new Date(entry.createdAt).toLocaleString(),
        temperature: parseFloat(entry[mapping.temperature]),
        outTemperature: parseFloat(entry[mapping.outTemperature]),
        settingTemp: parseFloat(entry[mapping.settingTemp]),
        current: parseFloat(entry[mapping.current]),
        fridgeId: entry.refrigerator_id,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error('[fetchData][Function] data include error', error);
    } finally {
      setLoading(false);
    }
  };

  /* Hook */
  React.useEffect(() => {
    const call = async () => {
      try {
        const result = await getAdmin();
        setAdminList(result.data);
        setTimeout(() => {
          setLoading(false);
        }, 450);
      } catch (e) {
        setLoading(false);
        console.log('[MobilePortal][useEffect] Error: ', e);
        window.alert(e.message);
      }
    };
    call();
  }, []);

  React.useEffect(() => {
    if (!selectedRefrigerator) return;
    setSelectedRefrigerator(null);
  }, [chooseAdmin]);
  /* Render */
  return (
    <Container>
      <Spin
        spinning={loading}
        tip="Loading"
        size="large"
        style={{ width: '100%', height: '100%' }}
      >
        <Body style={{ zIndex: 99 }}>
          <Row style={{ width: '100%', maxWidth: 1180 }}>
            {auth && (
              <Col span={6}>
                <div style={{ width: '94%' }}>
                  <TitleWrapper>
                    <Title>업체목록({adminList.length})</Title>
                    <AddButton onClick={handleClickAppendArea}>
                      {/* 업체검색 <SearchOutlined /> */}
                    </AddButton>
                  </TitleWrapper>

                  {/* === 업체목록 === */}
                  <SiteList
                    style={{
                      width: '100%',
                      minHeight: `calc(100vh - 450px)`,
                      padding: 5.5,
                      maxHeight: 'calc(100vh - 450px)',
                      overflowY: 'auto',
                    }}
                  >
                    {adminList.length < 1 || !adminList ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          minHeight: 300,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Empty description="가입된 업체가 없습니다" />
                      </div>
                    ) : (
                      adminList?.map((item, index) => {
                        const { admin_id, admin_name, createdAt } = item;
                        const isSelect = admin_id === chooseAdmin?.admin_id;
                        const startDate = createdAt.split('T')[0];

                        return (
                          <SiteItem
                            key={`portal-projects-${index}`}
                            className="hover-opacity"
                            onClick={() => handleClickAdmin(item)}
                            style={{
                              padding: '15px 10px',
                              borderRadius: 10,

                              ...(isSelect && {
                                boxShadow: '0 0 0 0.5px #6ca1eb inset',
                                background: '#e6f4ff',
                              }),
                            }}
                          >
                            <div style={{ width: '95%' }}>
                              {/* 타이틀 */}
                              <SiteName
                                style={{ fontSize: '0.95em', display: 'flex' }}
                              >
                                <div>{admin_name}</div>
                              </SiteName>
                              {/* 기간 */}
                              <SiteDate>생성날짜 : {startDate}</SiteDate>
                            </div>
                          </SiteItem>
                        );
                      })
                    )}
                  </SiteList>
                  {/* === 업체목록 === */}
                </div>
              </Col>
            )}

            {/* ==== 냉장고 목록 ==== */}
            <Col span={auth ? 17 : 24}>
              <ServiceList>
                {auth ? (
                  <>
                    {/* === 컨텐츠 === */}
                    <Row>
                      {/* === 냉장고 목록 - start === */}
                      {!selectedRefrigerator ? (
                        chooseAdmin?.Refrigerators &&
                        chooseAdmin.Refrigerators.length > 0 ? (
                          chooseAdmin.Refrigerators.map((item, index) => {
                            const {
                              person_name,
                              person_birthday,
                              entry_date,
                              exit_date,
                              refrigerator_number,
                              setting_temp_value,
                              check_defrost,
                              defrost_value,
                              defrost_term,
                              defrost_time,
                              refrigerator_type,
                            } = item;

                            return (
                              <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                key={`item-${index}`}
                                style={{ marginBottom: 15 }}
                              >
                                <FridgeCard
                                  onClick={() => {
                                    setSelectedRefrigerator(item);
                                    fetchData(item); // 냉장고 선택 시 데이터 가져오기
                                  }}
                                >
                                  <CardHeader>
                                    {refrigerator_number} (
                                    {refrigerator_type === 'B'
                                      ? '분리형'
                                      : '일체형'}
                                    )
                                  </CardHeader>
                                  <CardBody>
                                    <Row>
                                      <Label>고인명:</Label>
                                      <Value>{person_name}</Value>
                                    </Row>
                                    <Row>
                                      <Label>생일:</Label>
                                      <Value>{person_birthday}</Value>
                                    </Row>
                                    <Row>
                                      <Label>입고일:</Label>
                                      <Value>
                                        {new Date(
                                          entry_date * 1000
                                        ).toLocaleDateString()}
                                      </Value>
                                    </Row>
                                    <Row>
                                      <Label>출고일:</Label>
                                      <Value>
                                        {new Date(
                                          exit_date * 1000
                                        ).toLocaleDateString()}
                                      </Value>
                                    </Row>
                                    <Row>
                                      <Label>설정 온도:</Label>
                                      <Value>{setting_temp_value}°C</Value>
                                    </Row>
                                    <Row>
                                      <Label>제상 여부:</Label>
                                      <Value>{check_defrost ? 'O' : 'X'}</Value>
                                    </Row>
                                    <Row>
                                      <Label>제상값:</Label>
                                      <Value>{defrost_value}</Value>
                                    </Row>
                                    <Row>
                                      <Label>제상 주기:</Label>
                                      <Value>{defrost_term}</Value>
                                    </Row>
                                    <Row>
                                      <Label>제상 시간:</Label>
                                      <Value>{defrost_time}</Value>
                                    </Row>
                                  </CardBody>
                                </FridgeCard>
                              </Col>
                            );
                          })
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              minHeight: 300,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Empty description="등록된 냉장고가 없습니다." />
                          </div>
                        )
                      ) : (
                        <Row>
                          {chartData.length > 0 ? (
                            <ResponsiveContainer width={1000} height={400}>
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* <XAxis dataKey="time" /> */}
                                <YAxis
                                  yAxisId="left"
                                  orientation="left"
                                  label={{
                                    value: '전류 (A)',
                                    angle: -90,
                                    position: 'insideLeft',
                                  }}
                                />
                                <YAxis
                                  yAxisId="right"
                                  orientation="right"
                                  label={{
                                    value: '온도 (℃)',
                                    angle: 90,
                                    position: 'insideRight',
                                  }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="temperature"
                                  stroke="#8884d8"
                                  name="내부 온도"
                                  dot={{ r: 2 }}
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="outTemperature"
                                  stroke="#82ca9d"
                                  name="외부 온도"
                                  dot={{ r: 2 }}
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="settingTemp"
                                  stroke="#413ea0"
                                  name="설정 온도"
                                  dot={{ r: 2 }}
                                />
                                <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="current"
                                  stroke="#ff7300"
                                  name="전류 값"
                                  dot={{ r: 2 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                minHeight: 300,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Empty description="온도 데이터가 없습니다." />
                            </div>
                          )}
                        </Row>
                      )}
                      {/* === 냉장고 목록 - end === */}
                    </Row>
                  </>
                ) : null}
              </ServiceList>
            </Col>
          </Row>
        </Body>
      </Spin>

      {/* === 업체 검색 모달=== */}
      <ModalLayout
        open={isOpenModal}
        title="업체 검색"
        width={525}
        onCancel={() => {
          setIsOpenModal(false);
          setSearchProjects([]);
        }}
      >
        <Divider style={{ margin: '15px 0' }} />
        {/* == 검색한 업체 목록 == */}
        <>
          <Input.Search
            size="large"
            enterButton="검색"
            placeholder="업체명을 입력해주세요"
            value={searchProjectKeyword}
            onChange={(e) => setSearchProjectKeyword(e.target.value)}
            onSearch={handleSearchProject}
          />
          <Spin
            spinning={searchLoading}
            tip="Loading"
            size="large"
            style={{ width: '100%', height: '100%' }}
          >
            <SiteList
              style={{
                minHeight: 185,
                padding: 5.5,
                width: '100%',
                marginTop: 8,
                border: 'none',
              }}
            >
              {isNull(searchProjects) ? (
                <Empty />
              ) : (
                searchProjects?.map((item, index) => {
                  const { admin_name, createdAt } = item;
                  const startDate = createdAt.split('T')[0];
                  return (
                    <SiteItem
                      key={`portal-projects-${index}`}
                      className="hover-opacity"
                      style={{
                        padding: '15px 12px',
                        borderRadius: 10,
                      }}
                      onClick={() => {
                        handleClickAdmin(item);
                        setIsOpenModal(!isOpenModal);
                      }}
                    >
                      <div>
                        <SiteName>{admin_name}</SiteName>
                        <SiteDate>{startDate}</SiteDate>
                      </div>
                    </SiteItem>
                  );
                })
              )}
            </SiteList>
          </Spin>
        </>
        <Divider style={{ margin: '15px 0' }} />
      </ModalLayout>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const SiteList = styled.div`
  flex: 1;
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 0px 10px;
  border: 1px solid #d3d3d3;
  width: 311px;
  box-sizing: border-box;
  margin-bottom: 15px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
`;

const SiteItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #e6e6e6;
`;

const SiteName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;

  span {
    font-size: 12px;
    color: #888;
  }
`;

const SiteDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const ServiceList = styled.div`
  flex: 2;
  min-height: 480px;
`;
const FridgeCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const CardHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.div`
  font-weight: 500;
  color: #555;
`;

const Value = styled.div`
  font-weight: 400;
  color: #111;
`;

export default DashBoards;
