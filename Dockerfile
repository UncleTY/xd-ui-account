FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

#添加default.conf到容器中
ADD default.conf /etc/nginx/conf.d
#将dist目录copy到nginx的工作空间【虚拟的工作空间】
COPY dist/ /usr/share/nginx/html/